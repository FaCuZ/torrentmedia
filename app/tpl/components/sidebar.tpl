<section class="sidebar">

	<!-- search form (Optional) -->
	<form action="#" method="get" class="sidebar-form" onsubmit="return false">
		<div class="input-group">
			<input type="text" name="q" id="tb-search" class="form-control" placeholder="{{ search }}">
			<span class="input-group-btn">
				<button type="submit" name="search" onclick="call.btn_search()" class="btn btn-flat">
					<i class="fa fa-search"></i>
				</button>
			</span>
		</div>
	</form>
	<!-- /.search form -->

	<!-- Sidebar Menu -->
	<ul class="sidebar-menu">
		<!-- <li class="header">DESCARGAS</li> -->
		<!-- Optionally, you can add icons to the links -->
		<!-- <li class="treeview active">
			<a href="#"><i class="fa fa-files-o"></i> <span>Descargas</span> <i class="fa fa-angle-left pull-right"></i></a>
			<ul class="treeview-menu">
				<li><a href="#">Activos</a></li>
				<li><a href="#">Compartiendo</a></li>
			</ul>
		</li> -->
		<!--  <li class="header">CANALES</li> -->
		<li id="btn_nav_main" onclick="call.btn_nav_main()" class="active">
			<a href="#"><i class="fa fa-download"></i> <span>{{ downloads.title }}</span></a>
		</li>			
		<!--			
		<li id="btn_nav_stats" onclick="call.btn_nav_stats()">
			<a href="#"><i class="fa fa-bar-chart"></i> <span>{{ stats.title }}</span></a>
		</li>
		-->	
		<li id="btn_nav_mediacast" onclick="call.btn_nav_mediacast()">
			<a href="#"><i class="fa icon-cast"></i> <span>{{ mediacast.title }}</span></a>
		</li>			
		<li id="btn_nav_autofeeds" onclick="call.btn_nav_autofeeds()">
			<a href="#"><i class="fa fa-feed"></i> <span>{{ autofeeds.title }}</span></a>
		</li>
		<li id="btn_nav_channels" onclick="call.btn_nav_channels()">
			<a href="#"><i class="fa fa-plug"></i> <span>{{ channels.title }}</span></a>
		</li>						
	</ul>
	<!-- /.sidebar-menu -->
	
	<!-- Bottom-menu -->
	<div class="sidebar-footer">
		<a data-original-title="{{ tooltip.settings }}" data-toggle="tooltip" data-placement="top" onclick="call.btn_bottom_settings()">
			<i class="fa fa-gear"></i>
		</a>
		<a data-original-title="{{ tooltip.stats }}" data-toggle="tooltip" data-placement="top" onclick="call.btn_nav_stats()">
			<i class="fa fa-bar-chart"></i>
		</a>
		<a data-original-title="{{ tooltip.hide }}" data-toggle="tooltip" data-placement="top" onclick="call.btn_bottom_hide()">
			<i class="fa fa-eye-slash"></i>
		</a>
		<a data-original-title="{{ tooltip.close }}" data-toggle="tooltip" data-placement="top" onclick="call.btn_bottom_close()">
			<i class="fa fa-power-off"></i>
		</a>
	</div>
	<!-- /.bottom-menu -->

</section>
