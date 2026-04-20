import Teacher from "../Model/teacher";
import Student from "../Model/student";
import Subject from "../Model/subject";
import {Request , Response, NextFunction } from "express";
import Plan from "../Model/teacherPlan";


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


// get last 5 things 
export const getRecentActivities = async (_req:Request, res:Response , next:NextFunction)=>{

   try {
      
      const student = await Student.find().sort({updatedAt : -1}).limit(5);
      const teacher = await Teacher.find().sort({updatedAt : -1}).limit(5);
      const plan = await Plan.find().sort({updatedAt : -1}).limit(5);


      return res.json({
         student,
         teacher,
         plan
      })

   } catch (error) {
      next(error)
   }
}