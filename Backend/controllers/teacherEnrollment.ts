import { Request, Response, NextFunction } from "express";
import teacherEnroll, { Iteachenrolment } from "../Model/teacherEnrollment";


export const  teacherEnrolled = async (req:Request<{},{},Iteachenrolment>, res:Response, next:NextFunction)=>{
  try {
    
    const { subjectId, teacherId, grade, section, year }= req.body
  
     const newsubject = await  teacherEnroll.create({subjectId, teacherId, grade, section, year })
     

      return res.status(201).json(newsubject)
  } catch (error) {
    next(error)
  }
}
