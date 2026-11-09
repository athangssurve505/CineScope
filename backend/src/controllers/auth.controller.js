import User from "../models/user.model.js";
import sendResponse from "../utils/response.util.js";
import bcrypt from "bcrypt"



export async function register(req, res) {
    try {
        const { name, email, password } = req.body;

        const emailExists = await User.exists({email});

        if(emailExists)  return sendResponse(
                res,
                400,
                "Email Already Exists",
                false
            ); 

        const hashedPassword = await bcrypt.hash(password,10)

        const user = await User.create({ name, email, 
            password:hashedPassword });

        if (!user) {
            return sendResponse(
                res,
                400,
                "Registration Failed",
                false
            );
        }

        return sendResponse(
            res,
            201,
            "Registration Successful",
            true,
            user
        );

    } catch (error) {
        return sendResponse(
            res,
            500,
            "Internal Server Error: "+error.message,
            false,
            
        );
    }
}


export async function login(req,res){
  try{  
    const {email , password} = req.body;

    const user = await User.findOne({email});

    if(!user) return sendResponse(
        res,
        401,
        "Invalid credentails",
        false
    );

    const isValidPassword =await bcrypt.compare(password,user.password);

    if(!isValidPassword) return sendResponse(
        res,
        401,
        "Invalid credentails",
        false
    );

    sendResponse(
        res,
        200,
        "Login Successfull",
        true
    );


  }catch(e){
     return sendResponse(
            res,
            500,
            "Internal Server Error: " + e.message,
            false,
            
        );
  }
}