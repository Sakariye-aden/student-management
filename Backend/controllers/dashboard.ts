import Teacher from "../Model/teacher";
import Student from "../Model/student";
import Subject from "../Model/subject";
import {Request , Response, NextFunction } from "express";


export const getAllCounts = async (_req:Request, res:Response, Next:NextFunction)=>{
  
     try {
        
        const totalStudent = await Student.countDocuments()
        const totalTeacher = await Teacher.countDocuments()
        const totalSubjects = await Subject.countDocuments()

        res.json({
            students : totalStudent,
            teachers : totalTeacher,
            subjects : totalSubjects
        })
     } catch (error) {
        Next(error)
     }
}