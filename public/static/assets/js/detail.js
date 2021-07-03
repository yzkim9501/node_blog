
	var	$window = $(window),$body = $('body');
$window.on('load', function() {
	let searchParams = new URLSearchParams(window.location.search)
	let postId = searchParams.get('postId')
	showPost(postId)
	showComment(postId)
	$('#commentPostId').val(postId)
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

function showComment(id){
	$.ajax({
		type: "GET",
		url: '/api/Allcomment/'+id,
		data: {},
		success: function(response) {
			let comments = response['comments']
			for(comment of comments){
				let temp_html=`<div class="be-comment">
				<div class="be-comment-content">
					<input type="hidden" id="${comment['commentId']}" />
					<span class="be-comment-name">
						<a href="blog-detail-2.html">${comment['author']}</a>
					</span>
					<span class="be-comment-time">
						<i class="fa fa-clock-o"></i>
						${comment['date']}
					</span>
					<p class="be-comment-text" style="margin-bottom:0" id="commentContent${comment['commentId']}">
					${comment['content']}
					</p>
					<ul style="display:flex;float:right">
						<li><button id="modCom${comment['commentId']}" onclick="modifyComment(${comment['commentId']})">수정</button></li>
						<li><button id="delCom${comment['commentId']}" onclick="deleteComment(${comment['commentId']})">삭제</button></li>
					</ul>
				</div>
			</div>`
			$('#comment-block').append(temp_html);
			}
		}
	});
}
function deleteComment(id){
	$.ajax({
		type: "DELETE",
		url: '/api/comment/'+id,
		data: {},
		success: function(response) {
			window.location.reload();
		}
	});
}
function modifyComment(id){
	if($('#modCom'+id).text()=="수정"){
		let temp=$.trim($('#commentContent'+id).text())
		$('#commentContent'+id).empty()
		$('#commentContent'+id).append(`
			<div class="col-xs-12">									
			<div class="form-group">
				<textarea class="form-input" id="content${id}" name="content" required="" placeholder="Your text">${temp}</textarea>
			</div>
		</div>
		`)
		$('#modCom'+id).html('수정 완료')
	}
	else{
		$.ajax({
			type: "PATCH",
			url: '/api/comment/',
			data: {commentId:id, content:$('#content'+id).val()},
			success: function(response) {
				window.location.reload();
			}
		});
	}
}