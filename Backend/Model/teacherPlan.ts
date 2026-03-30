import mongoose, { Document, Schema } from "mongoose";

export interface Iplan extends Document{
    title : string,
    description:string,
    createdBy: typeof Schema.Types.ObjectId,
}

const planSchema = new Schema<Iplan>({
     title : {type:String, required: true},
    description :{type :String , required:true },
    createdBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref:'User'
        }
}, { timestamps:true })

const Plan  = mongoose.model<Iplan>("plan", planSchema);

export default Plan;
