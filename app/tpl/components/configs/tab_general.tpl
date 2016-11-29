<form class="form-horizontal">
	<div class="form-group">
		<label class="col-sm-3 control-label">{{ configs.general.lenguage }}</label>

		<div class="col-sm-6">
			<select class="form-control" id="opt-locale" onchange="call.box_general_lenguage(this)">
				<option id="opt-locale-en" value="en">English</option>
				<option id="opt-locale-es" value="es">Español</option>
			</select>
		</div>
	</div>

	<div class="form-group">
		<div class="col-sm-offset-3 col-sm-10">
			<div class="checkbox">
				<label>
					<input type="checkbox" id="opt-exit_without_ask" onchange="call.chk_general_close()"> {{ configs.general.close }}
				</label>
			</div>
		</div>

		<div class="col-sm-offset-3 col-sm-10">
			<div class="checkbox">
				<label>
					<input type="checkbox" id="opt-start_hide" onchange="call.chk_general_hide()" > {{ configs.general.hide }}
				</label>
			</div>
		</div>
 

		<div class="col-sm-offset-3 col-sm-10">
			<div class="checkbox">
				<label>
					<input type="checkbox" id="opt-exit_forced" onchange="call.chk_general_minimize()"> {{ configs.general.minimize }}
				</label>
			</div>
		</div>

		<div class="col-sm-offset-3 col-sm-10">
			<div class="checkbox">
				<label>
					<input type="checkbox" id="opt-ask_on_delete" onchange="call.chk_general_delete()"> {{ configs.general.delete }}
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