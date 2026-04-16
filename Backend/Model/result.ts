import mongoose, { Document, Schema } from "mongoose";

export interface Iresult extends Document{
    subjectId: typeof Schema.Types.ObjectId,
    studentId: typeof Schema.Types.ObjectId,
    teacherId: typeof Schema.Types.ObjectId,
    score:number,
    type:"midterm" | "finalterm",
    year:number
}

const resultSchema = new Schema<Iresult>({
   subjectId:{
                   type: mongoose.Schema.Types.ObjectId,
                   ref:'Subject'
           },
   studentId:{
                   type: mongoose.Schema.Types.ObjectId,
                   ref:'Student'
           },
   teacherId:{
                   type: mongoose.Schema.Types.ObjectId,
                   ref:'Teacher'
           },
    score:{type:Number, required:true},     
    type:{type:String , enum:["midterm" , "finalterm"], default:"midterm"},
    year:{type:Number , required:true}     
})

resultSchema.index({ subjectId: 1, studentId: 1, type: 1 });

const Result  = mongoose.model<Iresult>("result", resultSchema);

export default Result;