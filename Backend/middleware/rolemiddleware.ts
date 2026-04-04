import { Request, Response, NextFunction } from "express"

type role = "principle" | "vice principle"| "dean of student" | "teacher"| "student";


export const authorizeRole = (...roles:role[])=>{
    
     return (req:Request, res:Response, next:NextFunction)=>{

        const user = (req as any).user
        if(!user){
            return res.status(401).json({
                message : "Not Authorized"
            })
        }
  
        if(!roles.includes(user.role)){
          return res.status(403).json({
            message:"Access denied : you don't have permission"
          })
        }

        next()
     }
}