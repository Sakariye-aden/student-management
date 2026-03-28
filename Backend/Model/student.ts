import mongoose, { Document, Schema } from "mongoose";

export interface Istudent extends Document{
    userId : typeof Schema.Types.ObjectId,
    fristname : string,
    lastname  : string ,
    gender : string ,
    dateofbirth : Date ,
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
    fristname : {type:String, required: true},
    lastname : {type:String, required: true},
    gender : {type:String, required: true},
    dateofbirth : {type:Date },
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


