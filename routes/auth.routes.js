const express = require('express'); 
const router = express.Router();   

const User = require("../models/User.model.js")

const bcrypt = require("bcryptjs")


//* RUTAS DE AUTENTICACIÓN

//* RUTAS GET Y POST CREACIÓN DE USUARIO
//* GET "/auth/signup" => Renderiza el formulario de registro de usuario.

router.get("/signup", (req, res, next)=>{

    res.render("auth/signup.hbs")


})


//* POST "/auth/signup" => Recibe la informacion del usuario que será creado en la base de datos

router.post("/signup", async (req, res, next)=>{ 
  
     if(req.body.username === "" || req.body.password === ""){
        
         res.render("auth/signup.hbs", {
             errorMessage: "Ambos campos son obligatorios."
         })
         return 
     }
 
     // Validación de contraseña 
     const regexPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm
     if (regexPattern.test(req.body.password) === false) {
         res.render("auth/signup.hbs", {
             errorMessage: "Tu contraseña no es suficientemente segura. Necesita al menos una mayúscula, una minúscula, un carácter especial y longitud de 8 caracteres."
           
         })
         return 
     }
     
     try {
         const foundUser = await User.findOne({username: req.body.username}) 
    
          if (foundUser !== null){
             res.render("auth/signup.hbs", {
                 errorMessage: "Ya existe ese nombre de usuario."
                 })
             return
          }
         
    //* Vamos a cifrar la contraseña 
    const salt = await bcrypt.genSalt(12)
    const hashPassword = await bcrypt.hash(req.body.password, salt)
 
   //* Ahora creariamos el usuario en la DB
         await User.create({
         username: req.body.username,
         password: hashPassword
       })
 
    //* TEST (Si todo sale bien)
 
     res.redirect("/auth/login")
     }
     catch (error) {
         next(error)
     }
         
 })

//* RUTAS GET Y POST CREACIÓN DE USUARIO DE INICIO DE SESIÓN

//* GET "/auth/login" => Renderiza el formulario de acceso a la página

router.get("/login", (req, res, next)=>{

    res.render("auth/login.hbs")
 

 })
 

//* POST "/auth/login" => Recibe las credenciales del usuario y valida su identidad.

router.post("/login", async (req, res, next)=>{

    if (req.body.username === "" || req.body.password === "" ){
        res.render("auth/login.hbs", {
            errorMessage: "Los campos de usuario y contraseña son obligatorios."
            
        })
        return
     }

     try {
        const foundUser = await User.findOne({username: req.body.username})
        if (foundUser === null) { 
          res.render("auth/login.hbs", {
              errorMessage: "No existe ese nombre de usuario."
          })
          return 
        }
        
        const isPasswordCorrect = await bcrypt.compare(req.body.password, foundUser.password)

        if (isPasswordCorrect === false)
       {
           res.render("auth/login.hbs", {
               errorMessage: "Contraseña incorrecta.",
             
           })
       
           return 
       } 
     } catch (error) {
        next(error)
     }




})



// ----------------------------------

module.exports = router; 