import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcrypt";

export interface Iusers extends Document {
  name: string;
  email: string;
  password: string;
  role: "principle" | "vice principle" |"dean of student"|"teacher"|"student";
  comparePassword(inputPassword: string): Promise<boolean>;
}

const userSchema = new Schema<Iusers>({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["principle","vice principle","dean of student", "teacher", "student"], // Allowed values for the 'role' field
    default: "student", // Default value if not specified
  },
}, { timestamps: true });

// hash pasword before saving it in database
userSchema.pre<Iusers>("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// compare password
userSchema.methods.comparePassword = function (
  this: Iusers,
  inputPassword: string,
): Promise<boolean> {
  return bcrypt.compare(inputPassword, this.password);
};

const User = mongoose.model<Iusers>("user", userSchema);

export default User;
