<!-- MODAL: Agregar Torrent -->
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
						<li class="active"><a aria-expanded="true" href="#tab_1" data-toggle="tab">{{ configs.general }}</a></li>
						<li class=""><a aria-expanded="false" href="#tab_2" data-toggle="tab">{{ configs.network }}</a></li>
						<li class=""><a aria-expanded="false" href="#tab_3" data-toggle="tab">{{ configs.advance }}</a></li>

						<li class="pull-right"><a href="#" class="text-muted"><i class="fa fa-gear"></i></a></li>
					</ul>
					<div class="tab-content">
						<div class="tab-pane active" id="tab_1">
							- Idioma  <br/>
							- Theme <br/>
						</div>

						<div class="tab-pane" id="tab_2">
							- Cantidad de Conexiones <br/>
						</div>

						<div class="tab-pane" id="tab_3">
							- Frecuencia de refresco de pantalla <br/>
							- Frecuencia de tray (parpadeo) <br/>
							- Restauracion de configuracion <br/>
						</div>
					  
					</div>
				</div>

				<p style="padding: 15px;">{{ alpha }}</p>


			</div>

			<div class="modal-footer">
				<button type="button" class="btn btn-default" data-dismiss="modal">{{ cancel }}</button>
				<button type="button" class="btn btn-primary" onclick="call.btn_add_download()" data-dismiss="modal">{{ save }}</button>
			</div>

		</div>
	</div>
</div>
<!-- MODAL END -->