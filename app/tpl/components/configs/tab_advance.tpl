<form class="form-horizontal">
	<div class="form-group">
		<div class="form-group">
			<label for="refresh" class="col-sm-6 control-label">Frecuencia de refresco de pantalla</label>

			<div class="col-sm-3">
				<input class="form-control" id="refresh" type="text">
			</div>
			<div class="col-sm-2 form-tip">ms</div>
		</div>

		<div class="form-group">
			<label for="tray" class="col-sm-6 control-label">Frecuencia de tray (parpadeo)</label>

			<div class="col-sm-3">
				<input class="form-control" id="tray" type="text">				
			</div>
			<div class="col-sm-2 form-tip">ms</div>			
		</div>



		<div class="col-sm-offset-2 col-sm-8">
			<button type="button" class="btn btn-block btn-danger" onclick="call.btn_advance_reset()">Restaurar la configuracion </button>
		</div>

	</div>
</form>