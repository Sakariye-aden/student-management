import { NextFunction, Request, Response } from "express";
import Teacher, { Iteacher } from "../Model/teacher";

// register teacher 
export const registerTeacher = async (req:Request<{},{},Iteacher>, res:Response, next:NextFunction)=>{
  
    try {
        const { userId, firstname, lastname, gender, phone,qualification }= req.body;

        const newTeacher = await Teacher.create({userId, firstname, lastname, gender, phone, qualification});



        return res.status(201).json(newTeacher)

    } catch (error) {
        next(error)
    }
}

// get one teacher 
export const getoneTeacher = async (req:Request, res:Response, next:NextFunction)=>{

    try {
        const { id }= req.params;
      
        if (!id || Array.isArray(id)) {
        throw new Error("Invalid id");
        }
      
    const oneTeacher = await Teacher.findOne({ userId: id });

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

// get students using pagination 
export const getTeacherPerLimit = async (req:Request, res:Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;

  const skip = (page - 1) * limit;

  const students = await Teacher.find().skip(skip).limit(limit);
  const total = await Teacher.countDocuments();

  res.json({
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    data: students,
  });
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



