
	var	$window = $(window),
	$body = $('body');
		$window.on('load', function() {
			let searchParams = new URLSearchParams(window.location.search)
			let postId = searchParams.get('postId')
			showPost(postId)
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});
function showPost(id){
	$.ajax({
		type: "GET",
		url: '/api/post/'+id,
		data: {},
		success: function(response) {
			let post = response["detail"];
			console.log(post)
			$('#title').val(post['title'])
			$('#content').val(post['content'])
			$('#date').val(post['date'])
			$('#author').val(post['author'])
			$('#postId').val(post['postId'])
		}
	});

}
