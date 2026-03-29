import mongoose, { Document, Schema } from "mongoose";

export interface Isubject extends Document{
    name : string,
}

const subjectSchema = new Schema<Isubject>({
    name : {type:String, required: true}
})

const Subject  = mongoose.model<Isubject>("subject", subjectSchema);

export default Subject;
