import { NextFunction, Request, Response } from "express";
import User from "../Model/users";
import { Iuser } from "../types/users";
import { generateToken } from "../utility/generateToken";



// register user 
export const registerUser = async (req:Request<{},{},Iuser>, res:Response, next:NextFunction)=>{

     try {
        const { name, email, password } = req.body
        const  Email = email.toLowerCase();
    //    check if user exist
        const user = await User.findOne({email:Email});

        if(user){
          return res.status(400).json({
                message : "email already exists"
            })
        }


        const newUser = await User.create({name, email , password});

        return res.status(201).json({
            name : newUser.name,
            email : newUser.email,
            message : "user registered succesfully"
        })
     } catch (error) {
        next(error)
     }
}

// log in user 
export const loginUser = async (req:Request, res:Response , next : NextFunction)=>{

     let  { email , password } = req.body
     try {
        
         email.toLowerCase(); 
        
        const user = await User.findOne({email})

          if(!user || !(await user.comparePassword(password))){
            return res.status(400).json({
                message: 'incorrect email or password'
            })
          }
         const id = user._id.toString() ;
        //  const userid = id.toString();

          const token = generateToken(id)

          return res.status(201).json({token})
     } catch (error) {
        console.log(error);
        next(error)
     }
}