import mongoose, { Document, Schema } from "mongoose";

export interface Istdenrolment extends Document{
    subjectId: typeof Schema.Types.ObjectId,
    studentId: typeof Schema.Types.ObjectId,
    grade:string,
    section:string,
    year:number
}

const studentEnrollmentSchema = new Schema<Istdenrolment>({
   subjectId:{
                   type: mongoose.Schema.Types.ObjectId,
                   ref:'Subject'
           },
   studentId:{
                   type: mongoose.Schema.Types.ObjectId,
                   ref:'Student'
           },
    grade:{type:String},     
    section:{type:String},
    year:{type:Number }     
})

const studentEnroll  = mongoose.model<Istdenrolment>("studentEnrollment", studentEnrollmentSchema);

export default studentEnroll;