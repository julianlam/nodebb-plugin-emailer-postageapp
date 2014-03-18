<h1><i class="fa fa-envelope-o"></i> Emailer (PostageApp)</h1>

<div class="row">
	<div class="col-lg-12">
		<blockquote>
			PostageApp is an Email Service Provider (ESP) with a no-hassle approach. We aim to get you set up within minutes for our simple email service, while not compromising on the cutting edge of deliverability best practices, such as DKIM, SPF, rigid RFC compliance and full participation in ISP Feedback Loops.
		</blockquote>
		<p>
			To get started:
		</p>
		<ol>
			<li>
				Register for an account on <a href="https://secure.postageapp.com/register">https://secure.postageapp.com/register</a>. PostageApp offers a free "Egg" plan with up to 100 free emails daily.
			</li>
			<li>
				Start a new "project", and copy it's API Key from the management panel (e.g. <code>ddQBmWBhb7rUu4Qs8e7SmBkbj278291f</code>)
			</li>
			<li>
				Paste that API key into the field below, hit save, and restart your NodeBB
			</li>
		</ol>
	</div>
</div>

<hr />

<form role="form" class="postageapp-settings">
	<fieldset>
		<div class="form-group">
			<label for="postageapp:apiKey">Project API Key</label>
			<input type="text" class="form-control" id="postageapp:apiKey" name="apiKey" />
		</div>

		<button type="button" class="btn btn-lg btn-primary" id="save">Save</button>
	</fieldset>
</form>

<script type="text/javascript">
	require(['settings'], function(Settings) {
		Settings.load('postageapp', $('.postageapp-settings'));

		$('#save').on('click', function() {
			Settings.save('postageapp', $('.postageapp-settings'), function() {
				socket.emit('admin.restart');
			});
		});
	});
</script>