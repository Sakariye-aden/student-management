import mongoose, { Document, Schema } from "mongoose";

export interface Iplan extends Document{
    title : string,
    description:string,
}

const planSchema = new Schema<Iplan>({
     title : {type:String, required: true},
    description :{type :String , required:true }
}, { timestamps:true })

const Plan  = mongoose.model<Iplan>("plan", planSchema);

export default Plan;
