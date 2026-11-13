import User from "../models/user.model.js";
import sendResponse from "../utils/response.util.js";
import { verifyToken } from "../utils/token.util.js";


export default async function verifyAccessToken(req, res, next){
    try{
         const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return sendResponse(
                res, 401, "Access Token not found", false
            );
        }

        const accessToken = authHeader.split(" ")[1];


            const decoded = verifyToken(accessToken,process.env.ACCESS_SECRET);

            const user = await User.findById(decoded.id).select("-password");


            if(!user) return sendResponse(res,401,"Invalid Token",false)

            req.user = user;    
             next();

    }catch(e){
        sendResponse(res,500,"Internal Server Error Occurred: "+e.message,false);
    }
}