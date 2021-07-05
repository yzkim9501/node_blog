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
			showPosts()
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
			if (localStorage.getItem("token")) {
				$('#header').append(`<button onclick="logout()">로그아웃</button>`)
			}else{
				$('#header').append(`<a href="/login">로그인</a>
				<a href="/join">회원가입</a>`)
			}
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
			<tr onclick="window.location='/detail?postId=${posts[i]['postId']}';">
				<td>${posts[i]['postId']}</td>
				<td>${posts[i]['title']}</td>
				<td>${posts[i]['author']}</td>
				<td>${posts[i]['date']}</td>
			</tr>`)
			}
		}
	});
}

function logout() {
    localStorage.clear();
    window.location.href = "/";
  }