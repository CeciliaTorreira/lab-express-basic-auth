const router = require("express").Router();

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

//* AUTENTICACIÓN

const authRouter = require("./auth.routes.js") 
router.use("/auth", authRouter) 


//---------------
module.exports = router;
