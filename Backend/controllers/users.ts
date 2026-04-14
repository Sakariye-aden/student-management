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


// get users for limit 
export const getLimitUser =  async (req:Request, res:Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      User.find().skip(skip).limit(limit),
      User.countDocuments(),
    ]);

    res.json({
      users,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};


// get users whos role is student and paginate 
export const getStudentRolebyLimit  = async (req:Request, res:Response) => {
  const role = req.query.role || "student"; // default to student
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;

  const skip = (page - 1) * limit;

  const users = await User.find({ role }).select('-password') // filter by role
    .skip(skip)
    .limit(limit);

  const total = await User.countDocuments({ role });
 

  res.json({
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    data: users,
  });
}

// get users role whos role is teacher 

export const getTeacherRolebyLimit  = async (req:Request, res:Response) => {
  const role = req.query.role || "teacher"; // default to student
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;

  const skip = (page - 1) * limit;

  const users = await User.find({ role }) // filter by role
    .skip(skip)
    .limit(limit);

  const total = await User.countDocuments({ role });

  res.json({
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    data: users,
  });
}



// delete user 

export const deleteUser = async (req:Request, res:Response, next:NextFunction)=>{
  
   try {
       const { id } = req.params;
   
      const deleteOne= await User.findByIdAndDelete({_id:id})
      
      return res.json({
         message : "user deleted succesfully",
         id :deleteOne?._id
      })
   } catch (error) {
      next(error)
   }
  }