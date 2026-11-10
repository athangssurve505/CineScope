import jwt from "jsonwebtoken"


export function generateAccessToken(userId){
    return jwt.sign({id:userId},
        process.env.ACCESS_SECRET,
        {expiresIn:"15m"})
}

export function generateRefreshToken(userId,sessionId){
    return jwt.sign({id:userId,sid:sessionId},
        process.env.REFRESH_SECRET,
        {expiresIn:"7d"})
}


export function verifyToken(token){
   return jwt.verify(token,process.env.REFRESH_SECRET);

    
}