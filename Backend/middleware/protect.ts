import { NextFunction , Response, Request } from "express";
import jwt from 'jsonwebtoken'

const secret = process.env.JSON_SECRET_DEV as string;

interface  Iuser extends Request {
    user? : string
}
interface dec {
    id : string ;
    iat: number;
    exp : number
}

export const Protect = (req:Iuser, res:Response, next:NextFunction)=>{

     try {
        const Token = req.headers.authorization?.split(' ')[1];

        if(!Token){
            return res.status(401).json({
                message : "invalid token."
            })
        }

        const decode = jwt.verify(Token, secret) as dec
         console.log("decoded",decode);
        
        // const id = decode.id 

        req.user = decode.id
        
        next()
     } catch (error) {
        next(error)
     }
}