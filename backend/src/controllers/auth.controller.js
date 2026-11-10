import User from "../models/user.model.js";
import Session from "../models/session.model.js";

import bcrypt from "bcrypt"

import sendResponse from "../utils/response.util.js";
import { generateAccessToken,generateRefreshToken , verifyToken } from "../utils/token.util.js";
import deviceInfo from "../utils/deviceInfo.util.js";

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
             {
             id: user._id,
             name: user.name,
                email: user.email
             }
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

    
    const isValidPassword = await bcrypt.compare(password,user.password)


    if(!isValidPassword) return sendResponse(
        res,
        401,
        "Invalid credentails",
        false
    );
    
    // Info like ip , browswer , OS and other
    const otherInfo = deviceInfo(req);

     // Generate the Session
    const session = await Session.create({
        user:user._id,
        ...otherInfo,
        expiresAt:new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        
    })


    // Generate the Tokens 
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id , session._id);


    // Hash Refresh Token for the Session 
    const refreshTokenHash = await bcrypt.hash(refreshToken,10);

    // Set the Hash Refresh Token for the Session 
    session.refreshTokenHash = refreshTokenHash;
    await session.save();

    // Set refresh Token in Cookie
   res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/"
});

   return sendResponse(
        res,
        200,
        "Login Successfull",
        true,
        accessToken,
        
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


export async function rotateToken(req, res) {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return sendResponse(
                res,
                401,
                "Refresh token not found",
                false
            );
        }

        // Continue refresh-token validation...

        const decoded = verifyToken(refreshToken);
        
       const session = await Session.findOne({
         _id: decoded.sid,
         user: decoded.id,
         revoked: false,
         expiresAt: { $gt: new Date() }
        });

       
        if (!session) {
        return sendResponse(res, 401, "Invalid or expired session", false);
        }

        const isValid = await bcrypt.compare(refreshToken, session.refreshTokenHash);

        if (!isValid) {
        return sendResponse(res, 401, "Invalid refresh token", false);
        }

    const accessToken = generateAccessToken(decoded.id);
    const newRefreshToken = generateRefreshToken(decoded.id,decoded.sid);


    const hashedToken = await bcrypt.hash(newRefreshToken,10);

    session.refreshTokenHash = hashedToken;
    session.expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    session.lastActiveAt = new Date();

    await session.save();

    res.cookie("refreshToken", newRefreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/"
    });

    return sendResponse(
    res,
    200,
    "Token refreshed successfully",
    true,
    { accessToken }
    );

    } catch (e) {
        return sendResponse(res, 500, "Internal Server Error: "+ e.message, 
            false);
    }
}