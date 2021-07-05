const express = require("express");
const router = express.Router();//라우터라고 선언한다.
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const User = require("../schemas/user");
const authMiddleware = require("../middlewares/auth-middleware");

const postUsersSchema = Joi.object({
  nickname: Joi.string().alphanum().min(3).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(4).required(),
  confirmPassword: Joi.string().required(),
});
router.get("/is-login",async(req,res)=>{

})
router.post("/users", async (req, res) => {
  try {
    const {
      nickname,
      email,
      password,
      confirmPassword,
    } = await postUsersSchema.validateAsync(req.body);

    if (password !== confirmPassword) {
      res.status(400).send({
        errorMessage: "패스워드가 패스워드 확인란과 동일하지 않습니다.",
      });
      return;
    }
    if(password.indexOf(nickname)>-1){
      res.status(400).send({
        errorMessage: "패스워드에 닉네임을 포함시킬 수 없습니다.",
      });
      return;
    }
    const existEmail = await User.find({email});
    if (existEmail.length) {
      res.status(400).send({
        errorMessage: "이미 가입된 이메일이 있습니다.",
      });
      return;
    }
    const existName = await User.find({ nickname });
    if (existName.length) {
      res.status(400).send({
        errorMessage: "이미 가입된 닉네임이 있습니다.",
      });
      return;
    }
    const user = new User({ email, nickname, password });
    await user.save();

    res.status(201).send({});
  } catch (err) {
    console.log(err);
    res.status(400).send({
      errorMessage: err['message'],
    });
  }
});

const postAuthSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});
router.post("/auth", async (req, res) => {
  try {
    const { email, password } = await postAuthSchema.validateAsync(req.body);

    const user = await User.findOne({ email, password }).exec();
    if (!user) {
      res.status(400).send({
        errorMessage: "이메일 또는 패스워드가 잘못됐습니다.",
      });
      return;
    }

    const token = jwt.sign({ userId: user.userId }, "my-secret-key");
    console.log("user.js token:"+token)
    res.send({
      token,
    });
  } catch (err) {
      console.log(err);
    res.status(400).send({
      errorMessage: "요청한 데이터 형식이 올바르지 않습니다.",
    });
  }
});

router.get("/users/me", authMiddleware, async (req, res) => {
  const { user } = res.locals;
  res.send({
    user,
  });
});
module.exports = router;