import {Request, Response , NextFunction } from "express";
import Result, { Iresult } from "../Model/result";

export const enteringResult = async (req:Request<{},{},Iresult>, res:Response , next:NextFunction)=>{

    
     try { 
        
        const { subjectId, studentId, teacherId, grade, section, score, type, year }= req.body
        
        const newResult = await Result.create({subjectId, studentId, teacherId, grade, section, score, type, year });
        
        return res.status(201).json(newResult);
     } catch (error) {
        next(error)
     }
}


// calculating total result 
export const calculateResult = async (req:Request, res:Response , next:NextFunction)=>{
   
    try {
      const { type, grade, section } = req.query;
   
        console.log("term ", type, grade, section);
       


      const total = await Result.aggregate([
        {
          $match: { type : type , grade:Number(grade), section:section }, // change to 2 for second term
        },
        {
          $group: {
            _id: "$studentId",
            totalScore: { $sum: "$score" },
            averageScore: { $avg: "$score" },
            subjects: { $addToSet: "$subjectId" },
            teacherIds: { $addToSet: "$teacherId" },
            years: { $addToSet: "$year" },
          },
        },
        {
          $sort: { totalScore: -1 },
        },
        {
          $setWindowFields: {
            sortBy: { totalScore: -1 },
            output: {
              rank: { $rank: {} },
            },
          },
        },
        {
          $lookup: {
            from: "students",
            localField: "_id",
            foreignField: "_id",
            as: "studentInfo",
          },
        },
        {
          $unwind: "$studentInfo",
        },
      //   {
      //   $match: { "studentInfo.grade": 7 } // <-- filter only Grade 10 students
      //   },

        {
          $project: {
            _id: 0,
            studentId: "$_id",
            studentName: "$studentInfo.firstname",
            //  grade: "$studentInfo.grade",
            totalScore: 1,
            averageScore: 1,
            subjects: 1,
            teacherIds: 1,
            years: 1,
            rank: 1,
          },
        },
      ]);

      return res.json(total);

    } catch (error) {
      next(error);
    }
}
