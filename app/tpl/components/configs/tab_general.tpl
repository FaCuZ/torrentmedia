<form class="form-horizontal">
	<div class="form-group">
		<label class="col-sm-2 control-label">Lenguaje</label>

		<div class="col-sm-10">
			<select class="form-control" onchange="call.box_general_lenguage(this)">
				<option value="en">English</option>
				<option value="es">Español</option>
			</select>
		</div>
	</div>

	<div class="form-group">
		<div class="col-sm-offset-2 col-sm-10">
			<div class="checkbox">
				<label>
					<input type="checkbox" onchange="call.chk_general_close()"> Preguntar al cerrar
				</label>
			</div>
		</div>
	</div>


	<div class="form-group">
		<div class="col-sm-offset-2 col-sm-10">
			<div class="checkbox">
				<label>
					<input type="checkbox" onchange="call.chk_general_minimize()"> Minimizar al cerrar
				</label>
			</div>
		</div>
	</div>


	<div class="form-group">
		<label class="col-sm-2 control-label">Theme</label>  
		<div class="col-sm-10">
			{{ include('./themes.tpl') }}
		</div>
	</div>

</form>