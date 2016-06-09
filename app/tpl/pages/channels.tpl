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





<h2 class="page-header">Instalados:</h2>
<!-- EJEMPLO DE CANALES -->
				<div class="row">
					<div class="col-md-3 col-sm-6 col-xs-12">
					  <div class="info-box">
						<span class="info-box-icon bg-aqua"><i class="ion ion-ios-gear-outline"></i></span>

						<div class="info-box-content">
						  <span class="info-box-text">CPU Traffic</span>
						  <span class="info-box-number">90<small>%</small></span>
						</div>
						<!-- /.info-box-content -->
					  </div>
					  <!-- /.info-box -->
					</div>
					<!-- /.col -->
					<div class="col-md-3 col-sm-6 col-xs-12">
					  <div class="info-box">
						<span class="info-box-icon bg-red"><i class="fa fa-google-plus"></i></span>

						<div class="info-box-content">
						  <span class="info-box-text">Likes</span>
						  <span class="info-box-number">41,410</span>
						</div>
						<!-- /.info-box-content -->
					  </div>
					  <!-- /.info-box -->
					</div>
					<!-- /.col -->

					<!-- fix for small devices only -->
					<div class="clearfix visible-sm-block"></div>

					<div class="col-md-3 col-sm-6 col-xs-12">
					  <div class="info-box">
						<span class="info-box-icon bg-green"><i class="ion ion-ios-cart-outline"></i></span>

						<div class="info-box-content">
						  <span class="info-box-text">Sales</span>
						  <span class="info-box-number">760</span>
						</div>
					  </div>
					</div>
					<div class="col-md-3 col-sm-6 col-xs-12">
					  <div class="info-box">
						<span class="info-box-icon bg-yellow"><i class="ion ion-ios-people-outline"></i></span>

						<div class="info-box-content">
						  <span class="info-box-text">New Members</span>
						  <span class="info-box-number">2,000</span>
						</div>
					  </div>
					</div>
				</div>
<!-- FIN EJEMPLO DE CANALES -->

				<h2 class="page-header">On the web:</h2>
				<div id="channels-web" class="row"></div>

			</div>
		</div>	
	
	</section>
</div>