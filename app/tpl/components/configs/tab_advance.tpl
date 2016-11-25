<form class="form-horizontal">
	<div class="form-group">
		<div class="form-group">
			<label for="config-adv-table" class="col-sm-6 control-label">{{ configs.advance.refresh.table }}</label>

			<div class="col-sm-3">
				<input class="form-control" id="config-adv-table" type="text">
			</div>
			<div class="col-sm-2 form-tip">ms</div>
		</div>

		<div class="form-group">
			<label for="config-adv-tray" class="col-sm-6 control-label">{{ configs.advance.refresh.tray }}</label>

			<div class="col-sm-3">
				<input class="form-control" id="config-adv-tray" type="text">				
			</div>
			<div class="col-sm-2 form-tip">ms</div>			
		</div>

		<div class="form-group">
			<label for="config-adv-footer" class="col-sm-6 control-label">{{ configs.advance.refresh.footer }}</label>

			<div class="col-sm-3">
				<input class="form-control" id="config-adv-footer" type="text">				
			</div>
			<div class="col-sm-2 form-tip">ms</div>			
		</div>

		<div class="col-sm-offset-2 col-sm-8">
			<button type="button" class="btn btn-block btn-danger" onclick="call.btn_advance_reset()">{{ configs.advance.restore }}</button>
		</div>

	</div>
</form>