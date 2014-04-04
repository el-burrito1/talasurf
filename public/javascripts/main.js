$(document).on('ready',function(){
 
  $('#surfForm').on('submit' , function(e){
  	e.preventDefault();
  	
  	$('.surfReport').empty()

  	$('#coolIcon').addClass("fa fa-spinner fa-spin")

  	$.ajax({
  		type: 'POST',
  		url: '/findBeach',
  		data: $('#surfForm').serialize(),
  		crossDomain: true,
  		success: function(data){
  			var result = JSON.parse(data);
  			var listBeaches = [];
  			listBeaches = result.filter(function(i){
  				return (i.spot_name.toLowerCase()) == ($('#beachSearch').val()).toLowerCase()
  			});

  			if(listBeaches[0] == undefined){
  				$('.surfReport').html('Sorry we do not have that beach in our database. Click <a id="viewBeaches">here</a> to view all available beaches')
  				$('#coolIcon').removeClass("fa fa-spinner fa-spin")	
  				$('#viewBeaches').on('click',function(){
  					$('#myModal').modal({show:true})
  				})
  			} else {

	  		var beachName = listBeaches[0].spot_name
  			var minWave = listBeaches[0].average.size_min;
  			var maxWave = listBeaches[0].average.size_max;


	  			$.ajax({
	  				type: 'POST',
	  				url: '/detailReport',
	  				data: listBeaches[0],
	  				crossDomain: true,
	  				success: function(data){
	  					var fulldayReport = JSON.parse(data);
	  					measure = fulldayReport.length;
	  					var conditions = (fulldayReport[measure-1].shape_full)
	  					$('.surfReport').html('The current surf at ' + beachName + ' is ' + minWave.toFixed(2) + '-' + maxWave.toFixed(2) + ' feet. Conditions are ' + conditions + '.')
  						$('#coolIcon').removeClass("fa fa-spinner fa-spin")	
  					}
	  			})
	  		} 
  		}
  	  })
	});


$('.protectLink').on('mouseenter' , function(){
  $(this).siblings('.overlayHover').animate({opacity:.5},300,function(){})
  $(this).children().animate({opacity:1},300,function(){})
})

$('.protectLink').on('mouseleave' , function(){
  $(this).siblings('.overlayHover').animate({opacity:0},300,function(){})
  $(this).children().first().animate({opacity:0},300,function(){})
})
  

  $('#masonry').masonry({
    columnWidth: 320,
    gutter:5,
    itemSelector: '.item',
  });

  $('#quarterMasonry').masonry({
    columnWidth: 238,
    gutter: 6,
    itemSelector:'.quarterItem',
  })

  $('#tripMasonry').masonry({
    columnWidth: 320,
    gutter: 5,
    itemSelector: '.tripItem'
  })


});