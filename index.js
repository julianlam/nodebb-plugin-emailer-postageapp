var	fs = require('fs'),
	path = require('path'),

	async = module.parent.require('async'),
	winston = module.parent.require('winston'),
	Meta = module.parent.require('./meta'),
	db = module.parent.require('./database'),

	Emailer = {};
	PostageApp = undefined,

Emailer.init = function(app, middleware, controllers) {
	function render(req, res, next) {
		res.render('admin/plugins/emailer-postageapp', {});
	}

	// Check for migration possibility
	async.waterfall([
		function(next) {
			db.getObjectField('config', 'postageapp:apiKey', next);
		},
		function(apiKey, next) {
			if (apiKey !== null) {
				db.setObjectField('settings:postageapp', 'apiKey', apiKey, next);
			} else {
				next(true);
			}
		},
		function(status, next) {
			db.deleteObjectField('config', 'postageapp:apiKey', next);
		}
	], function(err) {
		if (!err) {
			winston.info('===');
			winston.info('PostageApp migration -- restarting for compatibility');
			winston.info('===');
			Meta.restart();
		}
	});

	Meta.settings.getOne('postageapp', 'apiKey', function(err, apiKey) {
		PostageApp = require('postageapp')(apiKey);
	});

	app.get('/admin/plugins/emailer-postageapp', middleware.admin.buildHeader, render);
	app.get('/api/admin/plugins/emailer-postageapp', render);
};

Emailer.send = function(data, callback) {
	// Update the API key, if necessary
	if (PostageApp.getApiKey && PostageApp.setApiKey && PostageApp.getApiKey() !== Meta.config['postageapp:apiKey']) {
		PostageApp.setApiKey(Meta.config['postageapp:apiKey']);
	}

	PostageApp.sendMessage({
		recipients: data.to,
		subject: data.subject,
		from: data.from,
		content: {
			'text/html': data.html,
			'text/plain': data.plaintext
		}
	}, function() {
		winston.info('[emailer.postageapp] Sent `' + data.template + '` email to uid ' + data.uid);
		callback(null, data);
	}, function(message) {
		winston.warn('[emailer.postageapp] Unable to send `' + data.template + '` email to uid ' + data.uid + '!!');
		winston.error('[emailer.postageapp] ' + message);
		callback(null, data);
	});
}

Emailer.admin = {
	menu: function(custom_header, callback) {
		custom_header.plugins.push({
			"route": '/plugins/emailer-postageapp',
			"icon": 'fa-envelope-o',
			"name": 'Emailer (PostageApp)'
		});

		callback(null, custom_header);
	}
};

module.exports = Emailer;
