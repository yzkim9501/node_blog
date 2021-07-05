const express = require("express");
const router = express.Router();//라우터라고 선언한다.
const url = require('url');   
const Comment = require("../schemas/comment");
const authMiddleware = require("../middlewares/auth-middleware");
const comment = require("../schemas/comment");

//해당 포스트의 모든 댓글 조회
router.get("/Allcomment/:postId", authMiddleware, async (req, res, next) => {
  try {
    const { postId } = req.params;
    let comments = await Comment.find({ postId }).sort("-date").lean();
    for(let i=0;i<comments.length;i++){
      if(res.locals.user!=null &&comments[i]['author']==res.locals['user']['nickname']){
        comments[i]['mine']=true
      }else comments[i]['mine']=false
    }
    res.json({ comments: comments });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

//댓글 한개 조회
router.get("/comment/:commentId", async (req, res) => {
  const { commentId } = req.params;
  comment = await Comment.findOne({ commentId });
  res.json({ detail: comment });
});

//댓글 게시
router.post('/comment', authMiddleware, async (req, res) => {
  const recentComment = await Comment.find().sort("-commentId").limit(1);
  let commentId=1;
  if(recentComment.length!=0){
    commentId=recentComment[0]['commentId']+1
  }
  const author=res.locals['user']['nickname']
  const { postId, content} = req.body;
  const date=(new Date().format("yyyy-MM-dd a/p hh:mm:ss"))
  await Comment.create({ commentId, postId, content, author, date });
  res.redirect(req.get('referer'));
});

//댓글 삭제
router.delete("/comment/:commentId", async (req, res) => {
  const { commentId } = req.params;
    await Comment.deleteOne({ commentId });
    res.send({ result: "success" });
});

//댓글 수정
  router.patch("/comment/", async (req, res) => {
    const { content, commentId} = req.body;
    await Comment.updateOne({ commentId }, { $set: {content } });
    res.send({ result: "success" });
  })

module.exports = router;//얘 라우터라고 알려주는거임

Date.prototype.format = function(f) {
  if (!this.valueOf()) return " ";

  var weekName = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
  var d = this;
   
  return f.replace(/(yyyy|yy|MM|dd|E|hh|mm|ss|a\/p)/gi, function($1) {
      switch ($1) {
          case "yyyy": return d.getFullYear();
          case "yy": return (d.getFullYear() % 1000).zf(2);
          case "MM": return (d.getMonth() + 1).zf(2);
          case "dd": return d.getDate().zf(2);
          case "E": return weekName[d.getDay()];
          case "HH": return d.getHours().zf(2);
          case "hh": return ((h = d.getHours() % 12) ? h : 12).zf(2);
          case "mm": return d.getMinutes().zf(2);
          case "ss": return d.getSeconds().zf(2);
          case "a/p": return d.getHours() < 12 ? "오전" : "오후";
          default: return $1;
      }
  });
};

String.prototype.string = function(len){var s = '', i = 0; while (i++ < len) { s += this; } return s;};
String.prototype.zf = function(len){return "0".string(len - this.length) + this;};
Number.prototype.zf = function(len){return this.toString().zf(len);};
