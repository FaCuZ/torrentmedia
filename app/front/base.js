$(function () {

	tabla = $('#tabla').DataTable({
		"paging": false,
		"lengthChange": false,
		"searching": false,
		"ordering": true,
		"info": true,
		"autoWidth": true,
		"bInfo": false,
		"columns": [
						{ title: "#" },
						{ title: "Nombre" },
						{ title: "Tamaño" },
						{ title: "Progreso" },
						{ title: "Velocidad" },
						{ title: "Seeds/Peers" },
						{ title: "Tiempo Est." }
				]
	});
});