import {Request, Response, NextFunction } from "express";
import Subject, { Isubject } from "../Model/subject";


// register 
export const registerSubject = async (req:Request<{},{},Isubject>, res:Response, next:NextFunction)=>{
   
    try {
        const { name }= req.body;

        const newSubject = await Subject.create({name});
        return res.status(201).json(newSubject)
    } catch (error) {
        next(error)
    }
}


// get all teachers 
export const getSubjects = async (_req:Request, res:Response, next:NextFunction)=>{

    try {
       
        const Allteachers = await Subject.find({});

        return res.json(Allteachers)
    } catch (error) {
        next(error)
    }
}

// update student info 

export const updateSubject = async (req:Request, res:Response, next:NextFunction)=>{
  
   try {
       const { id } = req.params;
   
      const updateOne= await Subject.findByIdAndUpdate({_id:id}, req.body, {new: true})
      
      return res.status(201).json(updateOne)
   } catch (error) {
      next(error)
   }
}
// delete student info 

export const deleteSubject = async (req:Request, res:Response, next:NextFunction)=>{
  
   try {
       const { id } = req.params;
   
      const deleteOne= await Subject.findByIdAndDelete({_id:id})
      
      return res.json({
         message : "subject deleted succesfully",
         id :deleteOne?._id
      })
   } catch (error) {
      next(error)
   }
}