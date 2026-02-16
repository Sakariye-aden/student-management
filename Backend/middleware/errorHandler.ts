import { Request , Response, NextFunction} from "express";

export interface errorMessage {
    success : boolean,
    message : string,
    status: number
}

export const notFound = (req:Request , _res:Response, next:NextFunction)=>{
 
     const error:any  = new Error(`${req.method}, ${req.originalUrl} not Found`);

      error.status = 404 ;
    next(error)
}


export const errorHandler = (err:any, _req:Request, res:Response<errorMessage>, _next:NextFunction )=>{

     const status = err.status || 500;

      
     res.status(status).json({
        success: false,
        message: err.message || "some thing went wrong",
        status
     })
}