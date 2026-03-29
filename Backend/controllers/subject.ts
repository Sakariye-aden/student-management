import {Request, Response, NextFunction } from "express";
import Subject, { Isubject } from "../Model/subject";

export const registerSubject = async (req:Request<{},{},Isubject>, res:Response, next:NextFunction)=>{
   
    try {
        const { name }= req.body;

        const newSubject = await Subject.create({name});
        return res.status(201).json(newSubject)
    } catch (error) {
        next(error)
    }
}