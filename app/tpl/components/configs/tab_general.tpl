<form class="form-horizontal">
	<div class="form-group">
		<label class="col-sm-3 control-label">{{ configs.general.lenguage }}</label>

		<div class="col-sm-6">
			<select class="form-control" onchange="call.box_general_lenguage(this)">
				<option value="en">English</option>
				<option value="es">Español</option>
			</select>
		</div>
	</div>

	<div class="form-group">
		<div class="col-sm-offset-3 col-sm-10">
			<div class="checkbox">
				<label>
					<input type="checkbox" id="c-close" onchange="call.chk_general_close()"> {{ configs.general.close }}
				</label>
			</div>
		</div>

		<div class="col-sm-offset-3 col-sm-10">
			<div class="checkbox">
				<label>
					<input type="checkbox" id="c-hide" onchange="call.chk_general_hide()" > {{ configs.general.hide }}
				</label>
			</div>
		</div>
 

		<div class="col-sm-offset-3 col-sm-10">
			<div class="checkbox">
				<label>
					<input type="checkbox" id="c-minimize" onchange="call.chk_general_minimize()"> {{ configs.general.minimize }}
				</label>
			</div>
		</div>

		<div class="col-sm-offset-3 col-sm-10">
			<div class="checkbox">
				<label>
					<input type="checkbox" id="c-delete" onchange="call.chk_general_delete()"> {{ configs.general.delete }}
				</label>
			</div>
		</div>
	</div>


	<div class="form-group">
		<label class="col-sm-3 control-label">{{ configs.general.theme }}</label>  
		<div class="col-sm-6">
			{{ include('./themes.tpl') }}
		</div>
	</div>

</form>