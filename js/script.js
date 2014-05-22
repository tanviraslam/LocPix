$().ready(function(){
	displayMostPopularPics();
	getInput();
});

var instaloc = {};

function getInput(){
	$('form').submit(function(){
		var searchTag = $(this).find('input[name="search-tag"]').val();
		var searchLoc = $(this).find('input[name="search-loc"]').val();

		//Geocoding. Wanted to do this as a separate function. But that was not working.
		geoCode(searchLoc);
		//console.log(latlong);
		//Ajax for location tags
		
		
		//Ajax for search tags
		$.ajax({
			url: 'https://api.instagram.com/v1/tags/search',
			type: 'GET',
			dataType: 'jsonp',
		 	data: {
		 		'q': searchTag,
		 		'client_id' : '3c1e3c03496f41b49ff28840d7d8e3df'
		 	}
		})
		.done(function(result) {
			displayTaggedPics(result.data[0].name);
		})
		.fail(function() {
			console.log(error);
		});
	});
}

function displayTaggedPics(searchTag){
	$.ajax({
		url: 'https://api.instagram.com/v1/tags/' + searchTag + '/media/recent',
		type: 'GET',
		dataType: 'jsonp',
		data: {'client_id' : '3c1e3c03496f41b49ff28840d7d8e3df'}
	})
	.done(function(results) {
		//first remove the existing images
		clearDisplay();
		displayPicAjax(results);
	})
	.fail(function() {
		console.log("error");
	});
}

function displayMostPopularPics(){
	$.ajax({
		url: "https://api.instagram.com/v1/media/popular?client_id=3c1e3c03496f41b49ff28840d7d8e3df",
		type: "GET",
		dataType: "jsonp",
	}).done(function(results){
		clearDisplay();
		displayPicAjax(results);
	}).error(function(error){
		console.log(error);
	});
}


function goToProfile(pageLink){
	$('.pic').click(function(){
		window.open(pageLink);
	});
	
}


function displayPicAjax(results){
	var imgObj = results.data;

		$.each(imgObj, function(index, value){
			var imgUrl = value.images.standard_resolution.url;
			var instaPic = $('.template').clone().removeClass('template hidden')
										.find('.pop-pic').attr('src', imgUrl).parent();
			var instaUser = value.user;
			var userPic = instaUser.profile_picture;
			var userName = instaUser.full_name;
			var caption = "";
			var pageLink = value.link;

			goToProfile(pageLink);

			if(value.caption){
				caption = value.caption.text;
			}

			instaPic.find('.pop-pic').attr({
				'title' : caption
			});
			instaPic.find('.pop-pic-user').attr({
				'title': userName,
				'src' : userPic
			});

			$('.pic-container').append(instaPic);
		});
}

function clearDisplay(){
	var $template = $('.pic-container').children('.template');
	$('.pic-container').empty().html($template);	
}

function displayLocPics(searchLoc){
	//Take location and geocode to get lat long


	//Take lat long to get the pictures
}

function geoCode(location){
	//Using googles geocoding service here.
	var geocoder = new google.maps.Geocoder();
	geocoder.geocode({'address':location}, function(results, status){
		if(status === google.maps.GeocoderStatus.OK){
			//Returning the lat long of the place.
			var position =  results[0].geometry.location;
				$.ajax({
				url: 'https://api.instagram.com/v1/locations/search',
				type: 'GET',
				dataType: 'jsonp',
				data: {
					'lat' : position.k,
					'lng' : position.A,
					'client_id' : '3c1e3c03496f41b49ff28840d7d8e3df'
				}
				})
				.done(function(results) {
					//results.data[].id gives you the location id which you will use to get the image
					var imgObj = results.data;
				
					$.each(imgObj, function(index, val) {
						 /* iterate through array or object */
						 var locId = val.id;
						 $.ajax({
						 	url: 'https://api.instagram.com/v1/locations/'+locId+'/media/recent',
						 	type: 'GET',
						 	dataType: 'jsonp',
						 	data: {
						 		'client_id' : '3c1e3c03496f41b49ff28840d7d8e3df'
						 	}
						 })
						 .done(function(result) {
						 	if(result.data.length){
						 		console.log(result.data);
						 	}
						 	//var imgObj = result.data[0];
						 	//console.log(imgObj);
						 // 	var imgUrl = imgObj.standard_resolution.url;
						 // 	var instaPic = $('.template').clone().removeClass('template hidden')
							// 			.find('.pop-pic').attr('src', imgUrl).parent();
							// var instaUser = imgObj.user;
							// var userPic = instaUser.profile_picture;
							// var userName = instaUser.full_name;
							// var caption = "";
							// var pageLink = imgObj.link;

							// goToProfile(pageLink);

							// if(value.caption){
							// 	caption = value.caption.text;
							// }

							// instaPic.find('.pop-pic').attr({
							// 	'title' : caption
							// });
							// instaPic.find('.pop-pic-user').attr({
							// 	'title': userName,
							// 	'src' : userPic
							// });

							// $('.pic-container').append(instaPic);

						 })
						 .fail(function() {
						 	console.log("error");
						 });
					});
				})
				.fail(function(error) {
					console.log(error);
				});
		}
	});
}