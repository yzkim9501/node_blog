const express = require("express");
const router = express.Router();//라우터라고 선언한다.
const url = require('url');   
const Post = require("../schemas/post");
const authMiddleware = require("../middlewares/auth-middleware");

//url/post?category=drink
router.get("/post", async (req, res, next) => {
  try {
    const { category } = req.query;
    const posts = await Post.find({ category }).sort("-date");
    res.json({ posts: posts });
  } catch (err) {
    console.error(err);
    next(err);
  }
});
//포스트 상세 조회

//url/post/6
router.get("/post/:postId", authMiddleware, async (req, res) => {
  console.log("get")
  const { postId } = req.params;
  let mine=false;
  post = await Post.findOne({ postId: postId });
  if(res.locals.user!=null && post['author']==res.locals['user']['nickname']){
    mine=true
  }
  res.json({ detail: post ,mine:mine});
});

//포스트 게시
router.post('/post', authMiddleware, async (req, res) => {
  const recentPost = await Post.find().sort("-postId").limit(1);
  let postId=1;
  if(recentPost.length!=0){
    postId=recentPost[0]['postId']+1
  }
  const { title, content} = req.body;
  const author=res.locals['user']['nickname']
  const date=(new Date().format("yyyy-MM-dd a/p hh:mm:ss"))
  await Post.create({ postId, title, content, author, date });
  res.redirect(url.format({
    pathname:"/"
  }))
});

//포스트 삭제
router.delete("/post/:postId", async (req, res) => {
  const { postId } = req.params;
  const { password } = req.body;
  isExist = await Post.find({ postId });
  if(isExist[0]['password']==password){
    await Post.deleteOne({ postId });
    res.send({ result: "success" });
  }else{
    res.send({result : "failed"});
  }
});

//포스트 수정
  router.patch("/post/:postId", async (req, res) => {
    const { postId } = req.params;
    const { title, content, author, date, password } = req.body;
    isExist = await Post.find({ postId });
    if(isExist[0]['password']==password){
      await Post.updateOne({ postId }, { $set: { postId, title, content, author, date, password } });
      res.send({ result: "success" });
    }else{
      res.send({result : "failed"});
    }
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
