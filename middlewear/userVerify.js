
import { request, response } from "express";
import jwt from "jsonwebtoken"; 

const userVerifyMiddle=(request,response,next)=>{
    
    var token = request.headers.authorization.split(" ")[1];
    console.log(token);

    var decode=jwt.verify(token,process.env.JWT_SECRET_KEY)

    if(!decode){
        res.json({
            message:"token is invalid"
        })

    }
    else{
        next()
    }
    

}

export default userVerifyMiddle