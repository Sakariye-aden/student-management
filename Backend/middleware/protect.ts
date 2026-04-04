import { NextFunction , Response ,Request} from "express";
import jwt from 'jsonwebtoken'
import User from "../Model/users";
// import { Iusers } from "../Model/users";
const secret = process.env.JSON_SECRET_DEV as string;

// interface  Iuser extends Request {
//     user? : Iusers
// }
interface dec {
    id : string ;
    iat: number;
    exp : number
}

export const Protect = async (req:Request, res:Response, next:NextFunction)=>{

     try {
        const Token = req.headers.authorization?.split(' ')[1];

        if(!Token){
            return res.status(401).json({
                message : "invalid token."
            })
        }

        const decode = jwt.verify(Token, secret) as dec
        
        // const id = decode.id 
       const user = await User.findById({_id: decode.id}).select("-password")
        
        // console.log("user", user);   
          if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    (req as any ).user = user;
        // console.log('user', req.user);
        next()
     } catch (error) {
        next(error)
     }
}