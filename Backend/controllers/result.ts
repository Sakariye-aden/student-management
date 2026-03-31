import {Request, Response , NextFunction } from "express";
import Result, { Iresult } from "../Model/result";

export const enteringResult = async (req:Request<{},{},Iresult>, res:Response , next:NextFunction)=>{

    
     try { 
        
        const { subjectId, studentId, teacherId, score, type, year }= req.body
        
        const newResult = await Result.create({subjectId, studentId, teacherId, score, type, year });
        
        return res.status(201).json(newResult);
     } catch (error) {
        next(error)
     }
}


// updating result 
