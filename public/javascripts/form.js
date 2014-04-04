$(document).on('ready' , function(){
	
	$('#commentForm').on('submit' , function(e){
		e.preventDefault();

		$.ajax({
		  type: "POST",
		  url: '/comment',
		  data: $('#commentForm').serialize(),
		  crossDomain: true,
		  dataType:'json',
		  success: function(data){}	
		});

		$(this)[0].reset()
	})
})