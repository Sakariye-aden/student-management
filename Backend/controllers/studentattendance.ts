import {Request, Response, NextFunction } from "express";
import studentAttendance, { Istdattendance } from "../Model/studentattendance";

// taking Student attendance 

export const takingStudentattendance = async (req:Request<{},{},Istdattendance>, res:Response, next:NextFunction)=>{
 
    try {
        
        const { grade, section, date , students }= req.body;

        const newAttendance = await studentAttendance.create({grade, section, date, students });
       
        return res.status(201).json(newAttendance)

    } catch (error) {
        next(error)
    }
}