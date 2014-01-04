<h1><i class="fa fa-envelope-o"></i> Emailer (PostageApp)</h1>

<div class="alert alert-info">
	<p>
		blergh blergh
	</p>
</div>

<form role="form">
	<fieldset>
		<div class="form-group">
			<label for="postageapp:apiKey">Project API Key</label>
			<input type="text" class="form-control" id="postageapp:apiKey" data-field="postageapp:apiKey" />
		</div>

		<button class="btn btn-lg btn-primary" id="save">Save</button>
	</fieldset>
</form>

<script type="text/javascript">
	require(['forum/admin/settings'], function(Settings) {
		Settings.prepare();
	});
</script>