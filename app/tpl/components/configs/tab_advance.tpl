<form class="form-horizontal">
	<div class="form-group">
		<div class="form-group">
			<label for="opt-interval.table" class="col-sm-6 control-label">{{ configs.advance.refresh.table }}</label>

			<div class="col-sm-2">
				<input class="form-control" id="opt-interval_table" type="number" onchange="call.tb_advance_table()">
			</div>
			<div class="col-sm-2 form-tip">ms</div>
		</div>

		<div class="form-group">
			<label for="opt-interval.tray" class="col-sm-6 control-label">{{ configs.advance.refresh.tray }}</label>

			<div class="col-sm-2">
				<input class="form-control" id="opt-interval_tray" type="number" onchange="call.tb_advance_tray()">				
			</div>
			<div class="col-sm-2 form-tip">ms</div>			
		</div>

		<div class="form-group">
			<label for="opt-interval.footer" class="col-sm-6 control-label">{{ configs.advance.refresh.footer }}</label>

			<div class="col-sm-2">
				<input class="form-control" id="opt-interval_footer" type="number" onchange="call.tb_advance_footer()">				
			</div>
			<div class="col-sm-2 form-tip">ms</div>			
		</div>

		<div class="col-sm-offset-2 col-sm-8">
			<button type="button" class="btn btn-block btn-danger" onclick="call.btn_advance_reset()">{{ configs.advance.restore }}</button>
		</div>

	</div>
</form>