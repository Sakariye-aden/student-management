import mongoose, { Document, Schema } from "mongoose";

export interface Iteachenrolment extends Document{
    subjectId: typeof Schema.Types.ObjectId,
    teacherId: typeof Schema.Types.ObjectId,
    grade:string,
    section:string,
    year:number
}

const teacherenrollmentSchema = new Schema<Iteachenrolment>({
   subjectId:{
                   type: mongoose.Schema.Types.ObjectId,
                   ref:'Subject'
           },
   teacherId:{
                   type: mongoose.Schema.Types.ObjectId,
                   ref:'Teacher'
           },
    grade:{type:String},     
    section:{type:String},
    year:{type:Number }     
})

const teacherEnroll  = mongoose.model<Iteachenrolment>("teacherenrollment", teacherenrollmentSchema);

export default teacherEnroll;