import {Request, Response, NextFunction } from "express";
import Student, { Istudent } from "../Model/student";

// register student
export const registerStudent = async (req:Request<{},{},Istudent>, res:Response , next:NextFunction)=>{

     try {
        
        const { userId, fristname,lastname,gender,dateofbirth,grade,section,parentname,phone,relationship } = req.body

        const newStudent = await Student.create({ userId, fristname,lastname,gender,dateofbirth,grade,section,parentname,phone,relationship });

        return res.status(201).json({
            newStudent,
            message : "student registered successfully"
        })
     } catch (error) {
        next(error)
     }
}

// get one student 
export const getoneStudentinfo = async (req:Request, res:Response, next:NextFunction)=>{
  
   try {
      const { id } = req.params;
   
      const onestudent = await Student.findById({_id:id});

       if(!onestudent){
         return res.status(400).json({
            message : "user not found please"
         })
       }

       return res.json(onestudent)
   } catch (error) {
      next(error)
   }
}
// get All students

export const getAllStudents = async (_req:Request, res:Response, next:NextFunction)=>{
  
   try {
      const Allstudents = await Student.find({});
      return res.json(Allstudents)
   } catch (error) {
      next(error)
   }
}

// update student info 

export const updateStudentinfo = async (req:Request, res:Response, next:NextFunction)=>{
  
   try {
       const { id } = req.params;
   
      const updateOne= await Student.findByIdAndUpdate({_id:id}, req.body, {new: true})
      
      return res.status(201).json(updateOne)
   } catch (error) {
      next(error)
   }
}
// delete student info 

export const deleteStudentinfo = async (req:Request, res:Response, next:NextFunction)=>{
  
   try {
       const { id } = req.params;
   
      const deleteOne= await Student.findByIdAndDelete({_id:id})
      
      return res.json({
         message : "student deleted succesfully",
         id :deleteOne?._id
      })
   } catch (error) {
      next(error)
   }
}
