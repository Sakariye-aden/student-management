import {Request, Response, NextFunction } from "express";
import teacherAttendance, { Itchrattendance } from "../Model/teacherAttendance";

// taking Student attendance 

export const takingTeacherattendance = async (req:Request<{},{},Itchrattendance>, res:Response, next:NextFunction)=>{
 
    try {
        
        const {  date , teachers }= req.body;

        const newAttendance = await teacherAttendance.create({date, teachers });
       
        return res.status(201).json(newAttendance)

    } catch (error) {
        next(error)
    }
}