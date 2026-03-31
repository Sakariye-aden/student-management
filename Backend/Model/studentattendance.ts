import mongoose, { Document, Schema } from "mongoose";

export interface Istdattendance extends Document{
    grade : number,
    section : string,
    date : Date 
    students : { 
        studentId: typeof Schema.Types.ObjectId,
        status : "present" | "absent" | "excused" 
     }[];
}

const stdattendanceSchema = new Schema<Istdattendance>({
    grade:{type :Number , required : true},
    section:{type :String },
    date :{type :Date , default : Date.now()},
   
    students :[
        {
         studentId:{
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

const studentAttendance  = mongoose.model<Istdattendance>("studentattendance", stdattendanceSchema);

export default studentAttendance;