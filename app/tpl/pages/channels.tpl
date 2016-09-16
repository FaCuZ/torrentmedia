<!--/////// DYNAMIC CONTENT: CHANNELS ///////-->
<div class="content-wrapper content-wrapper-channels">

	<!-- Content Header (Page header) -->
	<section class="content-header content-header-main">
			
		<h1>{{ channels.title }} <small class="db-download">{{ channels.all }} </small></h1>

	</section>
	
	<!-- Modal Alert -->
	<div class="modal fade" id="modal_alert" tabindex="-1" role="dialog" aria-labelledby="settingsModalLabel">
		<div class="modal-dialog" role="document">
			<div class="alert alert-warning alert-dismissible channels-alert">
				<button type="button" class="close" onclick="call.btn_channels_alert()">×</button>
				<h4><i class="icon fa fa-warning"></i>{{ channels.warning }}</h4>
				{{ channels.warning_msg }}
				<div class="btn-wrapper">
					<a href="#" onclick="call.btn_channels_alert()">
					  <i class="fa fa-check"></i> {{ channels.warning_btn }}
					</a>
				</div>
			</div>
		</div>
	</div>


	<!-- Main content -->
	<section class="content content-main">

		<div class="row">
			<div class="col-xs-12">

<!--			<h2 class="page-header">Instalados:</h2> -->

				<div id="channels-installed" class="row">
					<div class="empty-box text-center">{{ channels.not_installed }}</div>					
				</div>

				<h2 class="page-header">{{ channels.title_web }}</h2>
				<div id="channels-web" class="row"></div>

			</div>
		</div>	
	
	</section>
</div>