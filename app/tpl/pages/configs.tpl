<!-- MODAL: configuracion -->
<div class="modal fade" id="modal_configs" tabindex="-1" role="dialog" aria-labelledby="configsModalLabel">
	<div class="modal-dialog" role="document">
		<div class="modal-content">

			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
				<h4 class="modal-title" id="configsModalLabel">{{ configs.title }}</h4>
			</div>

			<div class="modal-body-configs">
				

				<div class="nav-tabs-custom">
					<ul class="nav nav-tabs">
						<li class="active"><a aria-expanded="true" href="#tab_1" data-toggle="tab">{{ configs.general.tab }}</a></li>
						<li class=""><a aria-expanded="false" href="#tab_2" data-toggle="tab">{{ configs.network.tab }}</a></li>
						<li class=""><a aria-expanded="false" href="#tab_3" data-toggle="tab">{{ configs.advance.tab }}</a></li>

						<!-- <li class="pull-right"><a href="#" class="text-muted"><i class="fa fa-gear"></i></a></li> -->
					</ul>
					<div class="tab-content">

						<div class="tab-pane active" id="tab_1">
							{{ include('../components/configs/tab_general.tpl') }}							
						</div>

						<div class="tab-pane" id="tab_2">
							{{ include('../components/configs/tab_network.tpl') }}							
						</div>

						<div class="tab-pane" id="tab_3">
							{{ include('../components/configs/tab_advance.tpl') }}							
						</div>

					</div>
				</div>



			</div>

			<div class="modal-footer">
				<button type="button" class="btn btn-default" data-dismiss="modal">{{ cancel }}</button>
				<button type="button" class="btn btn-primary" onclick="call.btn_configs_save()" data-dismiss="modal">{{ save }}</button>
			</div>

		</div>
	</div>
</div>
<!-- MODAL END