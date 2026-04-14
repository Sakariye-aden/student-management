import mongoose, { Document, Schema } from "mongoose";

export interface Itchrattendance extends Document{
    date : Date 
    teachers : { 
        teacherId: typeof Schema.Types.ObjectId,
        status : "present" | "absent" | "excused" 
     }[];
}

const teacherattendanceSchema = new Schema<Itchrattendance>({
    date :{type :Date , default : Date.now()},
    teachers :[
        {
         teacherId:{
                   type: mongoose.Schema.Types.ObjectId,
                   ref:'Student',
                   required : true
           },
         status : {
            type : String , 
            enum : ["present", "absent", "excused"],
            default : "present"
         }
      }
    ]
})
teacherattendanceSchema.index({ date: 1 }, { unique: true });

const teacherAttendance  = mongoose.model<Itchrattendance>("teacherattendance", teacherattendanceSchema);

export default teacherAttendance;