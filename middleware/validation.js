const jwt = require("jsonwebtoken");

module.exports = {
    validateRegis : async (req, res, next) => {
        if (
            req.body.password.length >= 8 &&
            req.body.password === req.body.confirmPassword
        ){
            next ();
        }else {
            return res.status(400).send({
                success: false,
                message:"your password is not valid, please check password with minimum 8 character, equal for password with confirm password"
            })      
        }
    }, 

    validateToken : (req, res, next) => {
        try {
            if(!req.token){
                return res.status(400).send({
                    success: false,
                    message: "You not have a token"
                })
            }else{
                const verifyData = jwt.verify(req.token, process.env.SCRT_TKN);
                if(!verifyData){
                    return res.status(401).send({
                        success : false,
                        message: "nautorized request"
                    });
                }
                req.userData = verifyData;
                next()
            }
        } catch (error) {
            console.log(error);
            return res.status(400).send('Invalid Token');
            
        }
        
    }
}
