<!--/////// DYNAMIC CONTENT: CHANNELS ///////-->
<div class="content-wrapper content-wrapper-channels">

	<!-- Content Header (Page header) -->
	<section class="content-header content-header-main">
			
		<h1>{{ channels.title }} <small class="db-download">{{ channels.all }} </small></h1>

	</section>

	<!-- Main content -->
	<section class="content content-main">

		<div class="row">
			<div class="col-xs-12">

				<div class="alert alert-warning alert-dismissible channels-alert">
					<button type="button" class="close" onclick="call.btn_channels_alert()">×</button>
					<h4><i class="icon fa fa-warning"></i> {{ channels.warning }}</h4>
					{{ channels.warning_msg }}
					<div class="btn-wrapper">
						<button type="button" class="btn btn-danger btn-alert" onclick="call.btn_channels_alert()">
						  <i class="fa fa-check"></i> {{ channels.warning_btn }}
						</button>
					</div>
				</div>

				<div class="box">
					<div class="box-body sin-padding">
						En esta seccion de puede instalar y configurar los canales.
					</div>
				</div>		  
			</div>
		</div>	
	
	</section>
</div>