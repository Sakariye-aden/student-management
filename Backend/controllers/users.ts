import { NextFunction, Request, Response } from "express";
import User from "../Model/users";
import { Iuser } from "../types/users";
import { generateToken } from "../utility/generateToken";



// register user 
export const registerUser = async (req:Request<{},{},Iuser>, res:Response, next:NextFunction)=>{

     try {
        const { name, email, password } = req.body
        const  Email = email.toLowerCase();
    //    check if user exist
        const user = await User.findOne({email:Email});

        if(user){
          return res.status(400).json({
                message : "email already exists"
            })
        }


        const newUser = await User.create({name, email , password});

        return res.status(201).json({
            name : newUser.name,
            email : newUser.email,
            message : "user registered succesfully"
        })
     } catch (error) {
        next(error)
     }
}

// log in user 
export const loginUser = async (req:Request, res:Response , next : NextFunction)=>{

     let  { email , password } = req.body
     try {
        
         email.toLowerCase(); 
        
        const user = await User.findOne({email})

          if(!user || !(await user.comparePassword(password))){
            return res.status(400).json({
                message: 'incorrect email or password'
            })
          }
         const id = user._id.toString() ;
        //  const userid = id.toString();


          const token = generateToken(id)
     // ✅ set HttpOnly cookie
     res.cookie("authToken", token, {
      httpOnly: false,
      secure: true,
      sameSite: "strict",
      maxAge: 4 * 24 * 60 * 60 * 1000, // 4 days 
     });
   
     res.json(user);

     } catch (error) {
        next(error)
     }
}

// logout logic 
export const logoutUser = (_req: Request, res: Response) => {
  res.clearCookie("authToken", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  });
  res.json({ message: "Logged out successfully" });
};

// get user in fo 

export const getMe = async (req: Request, res: Response) => {
  // ✅ At this point, Protect middleware has already verified the token
  // and attached the user to req.user
  const user = (req as any).user;

  if (!user) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  res.json(user);
};


// all users 
export const AllUsers = async (_req:Request, res:Response, next:NextFunction)=>{
  try {
    const all = await User.find({});

    res.json(all)
     
  } catch (error) {
    next(error)
  }
}