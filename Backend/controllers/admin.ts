import {Request, Response , NextFunction } from "express";
import User from "../Model/users";

export const updateUserRole = async (req:Request, res:Response , next:NextFunction)=>{

       
     try { 
        
        const { id } = req.params
        const { role } = req.body;


         const user = await User.findByIdAndUpdate(
            {_id:id},
             { role }
         )
    
      if(!user){
        return res.status(400).json({
            message : "user not found"
        })
      }
       return res.status(201).json({
            message : "updated the role successfully"
         })
     } catch (error) {
        next(error)
     }
}