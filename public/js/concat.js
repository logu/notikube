// connect to our socket server
var curl      = 'http://' + window.location.host + '/';
var socket = io.connect(curl);

var app = app || {};


// shortcut for document.ready
$(function(){

		//SOCKET STUFF
	socket.on("color_seted", function(data){
		$('#blast').val(data.msg);
	});
	
	$('body').on('change','#blast',function(){
		var color = $(this).val();
		if(color.length){
			socket.emit("set_color", {msg:color}, 
				function(data){
					
				});
		}
	});
	
});