$(document).on('ready', function(){

	$('#feature').on('change',function(){
		$('#videoCode').css('opacity' , 1);
		$('#imageCode').css('opacity' , .3);
		$('#blogURL').css('opacity' , .3);
	})

	$('#product').on('change' , function(){
		$('#imageCode').css('opacity' , 1);
		$('#blogURL').css('opacity' , 1);
		$('#videoCode').css('opacity' , .3)
	})

	$('#newPost').on('submit', function(e){
		e.preventDefault();

		$.ajax({
		  type: "POST",
		  url: '/createPost',
		  data: $('#newPost').serialize(),
		  crossDomain: true,
		  dataType:'json',
		  success: function(data){}	
		});

		$(this)[0].reset()
		
	});

	$('#newAdmin').on('submit' , function(e){
		e.preventDefault();

		$.ajax({
			type:'POST',
			url: '/newAdmin',
			data: $('#newAdmin').serialize(),
			crossDomain: true,
			dataType: 'json',
			success: function(data){
				console.log(data)
			}
		});

	});

	



})