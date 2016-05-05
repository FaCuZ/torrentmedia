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
	})


    var chooser = $('#folderSelector');
    chooser.unbind('change'); // Needed, otherwise the value will always be "" 
    chooser.change(function(evt) {
        var folder_path = $(this).val();
        $(this).val(''); // Reset value of selected directory (so change event will *always* be triggered)
        folder_selected(folder_path); // call the next function, passing the folder path to it
    });
   // chooser.trigger('click'); 

})