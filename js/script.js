$().ready(function(){
	displayMostPopularPics();
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
			var instaUser = value.user;
			var userPic = instaUser.profile_picture;
			var userName = instaUser.full_name;
			var caption = "";
			var pageLink = value.link;

			//populateModal(pageLink);

			if(value.caption){
				caption = value.caption.text;
			}
			// console.log(value);

			instaPic.find('.pop-pic').attr({
				'title' : caption
			});
			instaPic.find('.pop-pic-user').attr({
				'title': userName,
				'src' : userPic
			});

			$('.pic-container').append(instaPic);
		});
	}).error(function(error){
		console.log(error);
	});
}


function populateModal(pageLink){
	$('.modal-content').load(pageLink);
}
