<form class="form-horizontal">
	<div class="form-group">
		<div class="form-group">
			<label for="opt-announces" class="col-sm-4 control-label">{{ configs.network.announces }}</label>

			<div class="col-sm-7">
				<input class="form-control" id="opt-announces" type="text" onchange="call.tb_network_announces()">				
			</div>
		</div>

		<div class="form-group">
			<label for="opt-dir_downloads" class="col-sm-4 control-label">{{ configs.network.dir_downloads }}</label>

			<div class="col-sm-7">
				<input class="form-control" id="opt-dir_downloads" type="text" onchange="call.tb_network_directory()">				
			</div>
		</div>

		<div class="form-group">
			<label for="opt-conections_max" class="col-sm-4 control-label">{{ configs.network.conections_max }}</label>

			<div class="col-sm-3">
				<input class="form-control" id="opt-conections_max" type="number" onchange="call.tb_network_conections()">				
			</div>
		</div>


</form>