const { users } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")

module.exports = {
    
    getData: async(req, res, next) => {
        try {
            const result = await users.findAll();
            return res.status(200).send(result);
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    },

    // FEAT-REGIS
    register: async (req, res, next) => {
        try {
          console.log("CHECK DATA FROM CLIENT",req.body); 
          if(
            req.body.password.length >=8 && 
            req.body.password === req.body.confirmPassword){
            //lanjut registrasi

            // Lanjut register
            const isExist = await users.findOne({
                where: {
                    email:req.body.email
                },
            });

            if(isExist){
                return res.status(400).send({
                    success: false,
                    message : "Your password is not valid, please check password"
                });
            }
            delete req.body.confirmPassword;
            // HASH PASSWORD
            const salt = await bcrypt.genSalt(10);
           
            const hashPassword = await bcrypt.hash(req.body.password, salt);
            
            req.body.password = hashPassword
            await users.create(req.body);   

            return res.status(201).send({   
                success: true,
                message:"Berhasil menambah data"
            })
        }
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    },
    // FEAT-LOGIN
    login:async(req, res, next)=> {
        try {
            console.log("CHECK DATA LOGIN", req.body);
            const result = await users.findOne({
                where:{
                    email:req.body.email
                },
                raw: true,
              });
              console.log(result);
              const isValid = await bcrypt.compare(req.body.password, result.password);
              console.log(isValid);

              if (isValid){
                delete result.password;

                //GENARATE TOKEN
                const {id, email, phone, role, isVerified} = result;
                const token = jwt.sign({
                    id, 
                    role,
                    isVerified
                }, 
                process.env.SCRT_TKN, {
                    expiresIn:"1h"
                }
                );
                console.log(token);
                return res.status(200).send({
                    success : true,
                    result: {
                    email,
                    phone,
                    isVerified,
                    token
                    }
                })

              }else{
                return res.status(400).send({
                    success: false,
                    message: "You unauthenticate"
                })
              }

        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
            
        }

    },

    keepLogin: async(req, res, next) => {
        try {
            console.log(req.userData);
        // #menerjemahkan token / decription token
            const result = await users.findOne({
                where: {
                    id: req.userData.id,
                },
                raw: true
            });

            console.log(result);
            const {id, username, email, phone, role, isVerified} = result;
            const token = jwt.sign({id, username, role, isVerified}, process.env.SCRT_TKN, {
                expiresIn: "1h",
            });
            return res.status(200).send({
                success : " true",
                result: {
                    username,
                    email, 
                    phone,
                    isVerified,
                    token
                },
            });

        } catch (error) {
            console.log(error);
        }
    },

    checkWhoLogin: async(req, res, next) => {
        try {
            const result = await users.findOne({
                where:{
                    email:req.body.email,
                    role:req.body.role
                },
                raw: true
            });
            
            if( req.body.role === "admin"){
                return res.status(400).send({
                    success:false,
                    message: "you can't make any post"
                })
            }else{
                return res.status(200).send({
                    success:true,
                    message:"you can make any post"
                })
            }

        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    },

    requestPasswordReset: async (req, res, next) => {
        try {

            const result = await users.findOne({
                where: {
                    email: req.body.email
                }
            });
            
            if (!result) {
                return res.status(400).send("Email not found.");
            }
            
            const resetToken = jwt.sign(result, process.env.RESET_SECRET, {
                expiresIn: "1h" 
            });

            console.log(resetToken);
    
            // Store the reset token in the database with a timestamp
            await resetTokens.create({ email, token: resetToken });
    
            // Add the reset token to the response header
            res.setHeader("X-Reset-Token", resetToken);
    
            // Send an email to the user with a link containing the reset token
            const resetLink = `https://your-app-url/reset-password?token=${resetToken}`;
            // Send the reset link to the user via email
    
            return res.status(200).send("Password reset link sent to your email.");
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    },
    
      
    resetPassword: async (req, res, next) => {
        try {
          const { token, newPassword } = req.body;
    
          // Verify the reset token and get the associated email
          const decodedToken = jwt.verify(token, process.env.RESET_SECRET);
          const email = decodedToken.email;
    
          // Check if the token is still valid in the database
          const storedToken = await resetTokens.findOne({ where: { email, token } });
    
          if (!storedToken) {
            return res.status(400).send("Invalid or expired reset token.");
          }
    
          // Hash the new password and update it in the database
          const salt = await bcrypt.genSalt(10);
          const hashPassword = await bcrypt.hash(newPassword, salt);
          await users.update({ password: hashPassword }, { where: { email } });
    
          // Delete the used reset token from the database
          await storedToken.destroy();
    
          return res.status(200).send("Password reset successfully.");
        } catch (error) {
          console.log(error);
          return res.status(500).send(error);
        }
      },

    
};