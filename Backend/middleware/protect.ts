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
         const token = req.cookies.authToken; // ✅ read from cookie

        if(!token){
            return res.status(401).json({
                message : "No token provided."
            })
        }

        const decode = jwt.verify(token, secret) as dec
        
        // const id = decode.id 
       const user = await User.findById({_id: decode.id}).select("-password")
        
        // console.log("user", user);   
     if (!user) {
       return res.status(404).json({ message: "User not found." });
    } 

    (req as any ).user = user;
    
        next()
     } catch (error) {
        next(error)
     }
}