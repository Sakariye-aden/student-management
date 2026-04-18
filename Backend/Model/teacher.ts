import mongoose, { Document, Schema, Types } from "mongoose";

export interface Iteacher extends Document{
    userId : Types.ObjectId;   // ✅ correct type,
    firstname : string,
    lastname  : string ,
    gender : string ,
    phone : number,
    qualification : string
}

const teacherSchema = new Schema<Iteacher>({
    userId : {
            type: mongoose.Schema.Types.ObjectId,
            ref:'user'
    }, 
    firstname : {type:String, required: true},
    lastname : {type:String, required: true},
    gender : {type:String, required: true},
    phone: {type:Number},
    qualification : {type:String},
}, { timestamps: true })

const Teacher  = mongoose.model<Iteacher>("teacher", teacherSchema);

export default Teacher;
