import { Request, Response, NextFunction } from "express";
import teacherEnroll, { Iteachenrolment } from "../Model/teacherEnrollment";
import { Types } from "mongoose";


export const  teacherEnrolled = async (req:Request<{},{},Iteachenrolment>, res:Response, next:NextFunction)=>{
  try {
    
    const { subjectId, teacherId, grade, section, year }= req.body
  
     const newsubject = await  teacherEnroll.create({subjectId, teacherId, grade, section, year })
     

      return res.status(201).json(newsubject)
  } catch (error) {
    next(error)
  }
}

// get teacher enrolled his subjects 
export const  getTeacherenroll= async (req:Request, res:Response, next:NextFunction)=>{
  try {
     
    const { id } = req.params;

     if (!id || Array.isArray(id)) {
        throw new Error("Invalid id");
        }

         console.log('teacher enrollt')
   const enrollsubject = await teacherEnroll.find({teacherId: id})
     

      return res.json(enrollsubject)
  } catch (error) {
    next(error)
  }
}

// get teachers and his students he teaches 
export const  getteacherhisStudent= async (req:Request, res:Response, next:NextFunction)=>{
  try {
     
    const { id } = req.params;

     if (!id || Array.isArray(id)) {
        throw new Error("Invalid id");
        }

   const result = await teacherEnroll.aggregate([
        {
            $match: {
            teacherId: new Types.ObjectId(id),
            },
        },
        {
            $lookup: {
            from: "studentenrollments",
            let: {
                subjectId: "$subjectId",
                grade: "$grade",
                section: "$section",
            },
            pipeline: [
                {
                $match: {
                    $expr: {
                    $and: [
                        { $eq: ["$subjectId", "$$subjectId"] },
                        { $eq: ["$grade", "$$grade"] },
                        { $eq: ["$section", "$$section"] },
                    ],
                    },
                },
                },
                {
                $count: "count",
                },
            ],
            as: "studentsData",
            },
        },
        {
            $addFields: {
            studentsCount: {
                $ifNull: [{ $arrayElemAt: ["$studentsData.count", 0] }, 0],
            },
            },
        },
        {
            $group: {
            _id: null,
            totalStudents: { $sum: "$studentsCount" },
            },
        },
        ]);
       
     

      return res.json(result)
  } catch (error) {
    next(error)
  }
}


// get All teacher enrolled 

export const  getAllteacherEnrolls = async (_req:Request, res:Response, next:NextFunction)=>{

    try {
       
        const Allteachers = await teacherEnroll.find({});

        return res.json(Allteachers)
    } catch (error) {
        next(error)
    }
}

//get teacher and read subjectid
export const  readTeachersubject = async (_req:Request, res:Response, next:NextFunction)=>{

    try {
       
       const TchrEnrols = await teacherEnroll.find().populate("subjectId", "name")
                                       .populate("teacherId", "firstname");

        return res.json(TchrEnrols)
    } catch (error) {
        next(error)
    }
}




// update teacher enrolment 
export const updateTeacherEnroll = async (req:Request, res:Response, next:NextFunction)=>{
  
   try {
       const { id } = req.params;
   
      const updateOne= await teacherEnroll.findByIdAndUpdate({_id:id}, req.body, {new: true})
      
      return res.status(201).json(updateOne)
   } catch (error) {
      next(error)
   }
}

// delete teacher enrollment 
export const deleteTeacherEnroll = async (req:Request, res:Response, next:NextFunction)=>{
  
   try {
       const { id } = req.params;
   
      const deleteOne= await teacherEnroll.findByIdAndDelete({_id:id})
      
      return res.json({
         message : "teacher deleted succesfully",
         id :deleteOne?._id
      })
   } catch (error) {
      next(error)
   }
}
