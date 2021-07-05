
	var	$window = $(window),$body = $('body');
$window.on('load', function() {
	console.log("onload")
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
	console.log("showPost")
	$.ajax({
		type: "GET",
		url: '/api/post/'+id,
		headers: {
			"Authorization": `Bearer ${localStorage.getItem("token")}`,
		  },
		data: {},
		success: function(response) {
			let post = response["detail"];
			$('#title').val(post['title'])
			$('#content').val(post['content'])
			$('#date').val(post['date'])
			$('#author').val(post['author'])
			$('#postId').val(post['postId'])
			if(response["mine"]){
				$('#ifmine').append(`
				<li><input type="button" id="mod" value="수정" onclick="modify()"/></li>
				<li><input type="button" id="del" value="삭제" onclick="deletePost()"/></li>
				`)
			}

		},error: function (error) {
			console.log(error)
			alert(error)
		},
	});
}
function checkLogin(){
	if (localStorage.getItem("token")==null) {
		getSelf(function () {
		  alert("로그인이 되어있지 않습니다. 메인 페이지로 이동합니다.");
		  window.location.replace("/");
		});
	  }
}
function showComment(id){
	$.ajax({
		type: "GET",
		url: '/api/Allcomment/'+id,
		headers: {
			"Authorization": `Bearer ${localStorage.getItem("token")}`,
		  },
		data: {},
		success: function(response) {
			let comments = response['comments']
			console.log(comments)
			for(comment of comments){
				if(comment['mine']){
				let temp_html=`<div class="be-comment">
				<div class="be-comment-content" id="comment-${comment['commentId']}">
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
				} else{
					
				let temp_html=`<div class="be-comment">
				<div class="be-comment-content" id="comment-${comment['commentId']}">
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
				</div>
			</div>`
			$('#comment-block').append(temp_html);
				
				}
			}
		}
	});
}
function deleteComment(id){
	let confAlert = confirm("정말로 삭제하시겠습니까?");
	if(confAlert==true){
		$.ajax({
			type: "DELETE",
			url: '/api/comment/'+id,
			data: {},
			success: function(response) {
				window.location.reload();
			}
		});
	}
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
		if($.trim($('#content'+id).val())==""){
			alert("내용을 입력해주세요.")
			return;
		}
		let confAlert = confirm("정말로 수정하시겠습니까?");
		if(confAlert==true){
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
}

function postComment(){
	console.log($('#commentContent').val())
	$.ajax({
		type: "POST",
		url: `/api/comment`,
		headers: {
				"Authorization": `Bearer ${localStorage.getItem("token")}`,
			},
		data: {postId:$('#commentPostId').val(),content:$('#commentContent').val()},
		success: function (response) {
			window.location.replace("/");
		},
		error: function (error) {
			console.log(error)
			alert(error);
		},
		});
}
function modify(){
if($('#title').is(":disabled")){
  $("#title").removeAttr("disabled");
  $("#content").removeAttr("disabled");
  $("#password").removeAttr("disabled");
  $("#author").removeAttr("disabled");
  $("#mod").val("저장");
}
else{
$.ajax({
  type: "PATCH",
  url: `/api/post/`+$('#postId').val(),
  data: {title:$('#title').val(),content:$('#content').val(),password:$('#password').val(),author:$('#author').val()},
  success: function(response) {
	  if(response['result']=='success'){
		alert("수정되었습니다.")
		redirect();
	  }
	  else{
		  alert("비밀번호가 다릅니다.")
	  }
  }
  });
}
}
function deletePost(){
$.ajax({
  type: "DELETE",
  url: `/api/post/`+$('#postId').val(),
  data: {password:$('#password').val()},
  success: function(response) {
	  if(response['result']=='success'){
		alert("삭제되었습니다.")
		redirect();
	  }
	  else{
		  alert("비밀번호가 다릅니다.")
	  }
  }
  });
}
		function redirect(){
			window.location.href="/";
		}