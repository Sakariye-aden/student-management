import { Request, Response, NextFunction } from "express";
import studentEnroll, { Istdenrolment } from "../Model/studentenrollment";

export const studentEnrolled = async (req:Request<{},{},Istdenrolment>, res:Response, next:NextFunction)=>{
  try {
    
    const { subjectId, studentId, grade, section, year }= req.body
  
     const newsubject = await studentEnroll.create({subjectId, studentId, grade, section, year })
     

      return res.status(201).json(newsubject)
  } catch (error) {
    next(error)
  }
}
