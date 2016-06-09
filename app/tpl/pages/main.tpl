<!--/////// DYNAMIC CONTENT: MAIN ///////-->
<div class="content-wrapper content-wrapper-main">

	<!-- Content Header (Page header) -->
	<section class="content-header content-header-main">
			
		<h1>{{ downloads.title }}<small class="db-download">{{ downloads.all }}<i class="fa fa-angle-down"></i></small></h1>
		<!-- TODO: Cambio a fa-angle-down -->

		<div class="breadcrumb breadcrumb-botones">
			
			<span id="btns-hided" class="hide-btns">
				<button type="button" onclick="call.btn_pause()" class="btn btn-default" id="btn-pause"><i class="fa fa-pause"></i></button>
				
				<div class="btn-group">
					<button type="button" onclick="call.btn_cast()" class="btn btn-default" id="btn-cast"><i class="icon-cast"></i></button>
					<button type="button" onclick="call.btn_share()" class="btn btn-default"><i class="fa fa-share-alt"></i></button>
				</div>
				
				<div class="btn-group">
					<button type="button" onclick="call.btn_position_up()" class="btn btn-default"><i class="fa fa-arrow-up"></i></button>
					<button type="button" onclick="call.btn_position_down()" class="btn btn-default"><i class="fa fa-arrow-down"></i></button>
				</div>
				
				<button type="button" onclick="call.btn_remove()" class="btn btn-default"><i class="fa fa-remove"></i></button>
			</span>

			<button type="button" class="btn btn-default" data-toggle="----tooltip" data-original-title="{{ tooltip.add_modal }}" data-placement="bottom" onclick="call.btn_add_modal()"><i class="fa fa-plus"></i></button>
		</div>


		<!-- MODAL: Agregar Torrent -->
		<div class="modal fade" id="addModal" tabindex="-1" role="dialog" aria-labelledby="addModalLabel">
			<div class="modal-dialog" role="document">
				<div class="modal-content">

					<div class="modal-header">
						<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
						<h4 class="modal-title" id="addModalLabel">{{ downloads.new_torrent }}</h4>
					</div>

					<div class="modal-body">
						<form>
							<div class="form-group">
								<label for="torrent-tb" class="control-label">{{ downloads.download_torrent}}</label>
								<div class="input-group">
									<input type="text" class="form-control" id="tb-add-file" placeholder="{{ downloads.download_torrent_ph }}" >
									<div class="input-group-btn">
										<button type="button" class="btn btn-default" onclick="call.btn_add_fileDialog()">
											<i class="fa fa-fw fa-file-o"></i>
										</button>
									</div>
								</div>
							</div>

							<div class="form-group">
								<label for="ubicacion-tb" class="control-label">{{ downloads.download_folder }}</label>
								<div class="input-group">
									<input type="text" class="form-control" id="tb-add-folder">
									<div class="input-group-btn">
										<button type="button" class="btn btn-default" onclick="call.btn_add_folderDialog()">
											<i class="fa fa-fw fa-folder-open-o"></i>
										</button>
									</div>
								</div>
							</div>

						</form>
					</div>

					<div class="modal-footer">
						<button type="button" class="btn btn-default" data-dismiss="modal">{{ cancel }}</button>
						<button type="button" class="btn btn-primary" onclick="call.btn_add_download()" data-dismiss="modal">{{ download }}</button>
					</div>

				</div>
			</div>
		</div>
		<!-- MODAL END -->

	</section>

	<!-- Main content -->
	<section class="content content-main">

		<div class="row">
			<div class="col-xs-12">
				<div class="box">
					<div class="box-body sin-padding">
						<table id="table" class="table table-striped table-hover"><!-- TABLA DE TORRENTS --></table>
					</div><!-- /.box-body -->
				</div><!-- /.box -->			  
			</div><!-- /.col -->
		</div><!-- /.row -->			
	
	</section><!-- /.content -->
</div><!-- /.content-wrapper -->
