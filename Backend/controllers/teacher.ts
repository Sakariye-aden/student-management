import {Request, Response, NextFunction } from "express";
import Teacher, { Iteacher } from "../Model/teacher";

// register teacher 
export const registerTeacher = async (req:Request<{},{},Iteacher>, res:Response, next:NextFunction)=>{
  
    try {
        const {userId, fristname, lastname, gender, phone,qualification }= req.body;

        const newTeacher = await Teacher.create({userId, fristname, lastname, gender, phone, qualification});



        return res.status(201).json(newTeacher)

    } catch (error) {
        next(error)
    }
}

// get one teacher 
export const getoneTeacher = async (req:Request, res:Response, next:NextFunction)=>{

    try {
        const { id }= req.params;

        const oneTeacher = await Teacher.findById({_id:id});

        return res.json(oneTeacher)
    } catch (error) {
        next(error)
    }
}

// get all teachers 
export const getAllteachers = async (_req:Request, res:Response, next:NextFunction)=>{

    try {
       
        const Allteachers = await Teacher.find({});

        return res.json(Allteachers)
    } catch (error) {
        next(error)
    }
}

// update student info 

export const updateTeacher = async (req:Request, res:Response, next:NextFunction)=>{
  
   try {
       const { id } = req.params;
   
      const updateOne= await Teacher.findByIdAndUpdate({_id:id}, req.body, {new: true})
      
      return res.status(201).json(updateOne)
   } catch (error) {
      next(error)
   }
}
// delete student info 

export const deleteTeacher = async (req:Request, res:Response, next:NextFunction)=>{
  
   try {
       const { id } = req.params;
   
      const deleteOne= await Teacher.findByIdAndDelete({_id:id})
      
      return res.json({
         message : "teacher deleted succesfully",
         id :deleteOne?._id
      })
   } catch (error) {
      next(error)
   }
}

