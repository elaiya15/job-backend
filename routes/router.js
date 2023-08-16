const express = require("express");
const router = new express.Router();
const userdb = require("../models/userSchema");
var bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


// for user registration

router.post("/register", async (req, res) => {

    const {firstname,lastname,email, password, number, } = req.body;

    if (!firstname||!lastname || !email || !password ||!number ) {
       return res.status(422).json({ error: "fill all the details" })
    }

    try {

        const preuser = await userdb.findOne({ email: email });
        if (preuser) {
           return res.status(422).json({ error: "This Email is Already Exist" })}
         else {
            const finalUser = new userdb({
                firstname,lastname,email, password, number,
            });

            // here password hasing

            const storeData = await finalUser.save();

           
          return  res.status(201).json({ msg: "createdsuccess" })
        }
 }

     catch (error) {
       return res.status(422).json(error);
        console.log("error");
    }

} );




// user Login

router.post("/login", async (req, res) => {
    // console.log(req.body);

    const { email, password } = req.body;

    if (!email || !password) {
      return  res.status(422).json({ error: "fill all the details" })
    }

    try {
       const user = await userdb.findOne({email:email}).select("-password");
       const userValid = await userdb.findOne({email:email});
        if(userValid){
            const isMatch = await bcrypt.compare(password,userValid.password);
            if(!isMatch){
               return res.status(422).json({ error: "invalid details"})
            }else {
                const token = jwt.sign({user}, process.env.SECRET_KEY, {
                    expiresIn: "1hr",
                  });

                const result = {
                    token
                }
              return res.status(201).json({status:201,result})
            }
        }

    } catch (error) {
       return res.status(401).json(error);
        console.log(error);
    }
});



// // user valid
// router.get("/validuser",authenticate,async(req,res)=>{
//     try {
//         const ValidUserOne = await userdb.findOne({_id:req.userId});
//         res.status(201).json({status:201,ValidUserOne});
//     } catch (error) {
//         res.status(401).json({status:401,error});
//     }
// });


// user logout

// router.get("/logout",authenticate,async(req,res)=>{
//     try {
//         req.rootUser.tokens =  req.rootUser.tokens.filter((curelem)=>{
//             return curelem.token !== req.token
//         });

//         res.clearCookie("usercookie",{path:"/"});

//         req.rootUser.save();

//         res.status(201).json({status:201})

//     } catch (error) {
//         res.status(401).json({status:401,error})
//     }
// })


module.exports = router;




