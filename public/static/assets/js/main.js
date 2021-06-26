/*
	Directive by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

	var	$window = $(window),
		$body = $('body');

	// Breakpoints.
		breakpoints({
			wide:      [ '1281px',  '1680px' ],
			normal:    [ '981px',   '1280px' ],
			narrow:    [ '841px',   '980px'  ],
			narrower:  [ '737px',   '840px'  ],
			mobile:    [ '481px',   '736px'  ],
			mobilep:   [ null,      '480px'  ]
		});

	// Play initial animations on page load.
		$window.on('load', function() {
			console.log("test")
			showPosts()
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});

})(jQuery);
function showPosts(){
	$.ajax({
		type: "GET",
		url: `/api/post`,
		data: {},
		success: function(response) {
			let posts = response["posts"];
			for (let i = 0; i < posts.length; i++) {
			$('#posts-body').append(`
			<tr>
				<td>${posts[i]['postId']}</td>
				<td>${posts[i]['title']}</td>
				<td>${posts[i]['author']}</td>
				<td>${posts[i]['date']}</td>
			</tr>`)
			}
		}
	});
}