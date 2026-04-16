import { NextFunction, Request, Response } from "express";
import studentEnroll, { Istdenrolment } from "../Model/studentenrollment";
import { Schema } from "mongoose";

interface GetStudentsQuery {
  subjectId: typeof Schema.Types.ObjectId ;
  grade: string;
  section: string;
}



export const studentEnrolled = async (req:Request<{},{},Istdenrolment>, res:Response, next:NextFunction)=>{
  try {
    
    const { subjectId, studentId, grade, section, year }= req.body
  
     const newsubject = await studentEnroll.create({subjectId, studentId, grade, section, year })
     

      return res.status(201).json(newsubject)
  } catch (error) {
    next(error)
  }
}


// get All student enrolled 

export const  getAllstudentEnrolls = async (_req:Request, res:Response, next:NextFunction)=>{

    try {
       
        const Allteachers = await studentEnroll.find({});

        return res.json(Allteachers)
    } catch (error) {
        next(error)
    }
}


//get student and read subjectid
export const  readStudentsubject = async (_req:Request, res:Response, next:NextFunction)=>{

    try {
       
       const TchrEnrols = await studentEnroll.find().populate("subjectId", "name")
                                       .populate("studentId", "firstname");

        return res.json(TchrEnrols)
    } catch (error) {
        next(error)
    }
}

export const getStudentsBySubject = async (req:Request, res:Response) => {
  try {
    const { subjectId, grade, section } = req.query as unknown as GetStudentsQuery ;


    const enrollments = await studentEnroll.find({
      subjectId,
      grade :Number(grade),
      section,
    }as any).populate("studentId", "firstname"); // only get name

    

    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ message: "no Student enrolled this subject" });
  }
};


// update student enrolment 
export const updateStudentEnroll = async (req:Request, res:Response, next:NextFunction)=>{
  
   try {
       const { id } = req.params;
   
      const updateOne= await studentEnroll.findByIdAndUpdate({_id:id}, req.body, {new: true})
      
      return res.status(201).json(updateOne)
   } catch (error) {
      next(error)
   }
}

// delete student enrollment 
export const deleteStudentEnroll = async (req:Request, res:Response, next:NextFunction)=>{
  
   try {
       const { id } = req.params;
   
      const deleteOne= await studentEnroll.findByIdAndDelete({_id:id})
      
      return res.json({
         message : "teacher deleted succesfully",
         id :deleteOne?._id
      })
   } catch (error) {
      next(error)
   }
}
