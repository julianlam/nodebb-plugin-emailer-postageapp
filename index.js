var	fs = require('fs'),
	path = require('path'),

	winston = module.parent.require('winston'),
	Meta = module.parent.require('./meta'),

	PostageApp = require('postageapp')(Meta.config['postageapp:apiKey']),
	Emailer = {};

Emailer.send = function(data) {
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
	}, function(message) {
		winston.warn('[emailer.postageapp] Unable to send `' + data.template + '` email to uid ' + data.uid + '!!');
		winston.error('[emailer.postageapp] ' + message);
	});
}

Emailer.admin = {
	menu: function(custom_header, callback) {
		custom_header.plugins.push({
			"route": '/plugins/emailer-postageapp',
			"icon": 'fa-envelope-o',
			"name": 'Emailer (PostageApp)'
		});

		return custom_header;
	},
	route: function(custom_routes, callback) {
		fs.readFile(path.join(__dirname, 'admin.tpl'), function(err, tpl) {
			custom_routes.routes.push({
				route: '/plugins/emailer-postageapp',
				method: "get",
				options: function(req, res, callback) {
					callback({
						req: req,
						res: res,
						route: '/plugins/emailer-postageapp',
						name: 'Emailer (PostageApp)',
						content: tpl
					});
				}
			});

			callback(null, custom_routes);
		});
	}
};

module.exports = Emailer;