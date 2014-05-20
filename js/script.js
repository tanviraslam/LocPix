$().ready(function(){
	displayMostPopularPics();
	//hoverPic();
	getInput();
});

function getInput(){
	$('form').submit(function(){
		var searchTag = $(this).find('input[name="search-tag"]').val();
		var searchLoc = $(this).find('input[name="search-loc"]').val();
	});
}

function displayMostPopularPics(){
	$.ajax({
		url: "https://api.instagram.com/v1/media/popular?client_id=3c1e3c03496f41b49ff28840d7d8e3df",
		type: "GET",
		dataType: "jsonp",
	}).done(function(results){
		$('.pic').find('img').attr('src',results.data[0].images.standard_resolution.url);
		var imgObj = results.data;
		$.each(imgObj, function(index, value){
			var imgUrl = value.images.standard_resolution.url;
			var instaPic = $('.template').clone().removeClass('template hidden')
										.find('.pop-pic').attr('src', imgUrl).parent();
			var user = value.user;
			var userPic = user.profile_picture;
			var userName = user.full_name;

			instaPic.find('.user-pic img').attr('src', userPic);
			instaPic.find('.pop-pic-user').attr('title', userName);

			$('.pic-container').append(instaPic);
		});
	}).error(function(error){
		console.log(error);
	});
}

//To DO: Fix this. Background image is not being set.
function hoverPic(userName){
	$('document.body').on('mouseenter','.pic', function(){
		$('html').css('background', 'url(' + $(this).find('img').attr('src')+ ')');
	}).on('mouseover', '.pop-pic-user',function(){
				$(this).attr('title', userName);
		});
}