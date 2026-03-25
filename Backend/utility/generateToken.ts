import jwt from  'jsonwebtoken';
import dotenv from 'dotenv'

dotenv.config();

const JWT_SECRET_dev = process.env.JSON_SECRET_DEV as string;


export const generateToken = (userid:string)=>{
  return jwt.sign({id : userid}, 
   JWT_SECRET_dev ,{
        expiresIn : "1d"
    }
  )
}
