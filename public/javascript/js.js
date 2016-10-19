$( document ).ready(function() {

	$('.button').click(function(){
		$('.center').fadeOut(500).promise().done(function (){
			$('.center').load("../register .registerbox").fadeIn(500);
		});
	});

	$(document).on('click', ".alreadyLogin", function () {
		console.log("working!");
		$('.center').load("../login .registerbox");
	});
	$('.edit').on('click', function(){
	    $(this).closest('tr').find("td input").attr("readonly", false).focus();
	});
});
