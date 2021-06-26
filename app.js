const express = require('express') //express를 쓴다
const app = express()
const port = 3000// port 는 3000번

const connect=require('./schemas');
connect()
app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(express.static('public'))

const postRouter = require("./routers/post");//라우터를 생성한다. goods.js파일을 라우터로 사용한다.
app.use("/api", [postRouter]);//api를 호출해서 get등의 방식으로 데이터를 리턴한다

app.set('views', __dirname + '/views');//view 엔진 추가를 위한 코드
app.set('view engine', 'ejs');//ejs를 사용한다. html과의 차이는 ejs에서는 html파트에 바로 자바스크립트 코드 사용 가능. https://jinbroing.tistory.com/107

app.use((req, res, next) => {//만약 request가 들어오면 일단 이 부분을 통과한다. 여기서는 무조건 req를 콘솔에 찍고 다음으로 넘어간다.
  next();
});

app.get('/', (req, res)=>{
  res.render('index');
});
app.get('/new', (req, res)=>{
  res.render('newpost');
});
app.get('/detail', (req, res)=>{// localhost:5000/detail?goodsId=10의 형식으로 사용, id를 가져온다
  let id = req.query.postId;
  res.render('detail',{id});
});
app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`)
})