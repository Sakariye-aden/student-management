import {Request, Response, NextFunction } from "express";
import Plan, { Iplan } from "../Model/teacherPlan";

// register plan 
export  const registerPlan = async (req:Request<{},{},Iplan>, res:Response, next:NextFunction)=>{

     try {
        const {title, description, createdBy }= req.body
         
        const newplan = await Plan.create({title, description, createdBy });

        return res.status(201).json(newplan)
     } catch (error) {
        next(error)
     }
}
