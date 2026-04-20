import mongoose, { Document, Schema, Types } from "mongoose";

export interface Istudent extends Document{
    userId : Types.ObjectId,
    firstname : string,
    lastname  : string ,
    gender : string ,
    age : number ,
    grade : number,
    section : string 
    parentname :string,
    phone : number,
    relationship : string
}

const studentSchema = new Schema<Istudent>({
    userId : {
            type: mongoose.Schema.Types.ObjectId,
            ref:'User'
    }, 
    firstname : {type:String, required: true},
    lastname : {type:String, required: true},
    gender : {type:String, required: true},
    age: {type:Number, required:true },
    grade : {type:Number, required: true},
    section : {
        type: String,
        default: "A"
    },
    parentname : {type:String, required: true},
    phone: {type:Number},
    relationship : {type:String},
}, { timestamps: true })

const Student  = mongoose.model<Istudent>("student", studentSchema);

export default Student;


