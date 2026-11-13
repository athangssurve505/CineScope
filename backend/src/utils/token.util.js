import jwt from "jsonwebtoken"


export function generateAccessToken(userId){
    return jwt.sign({id:userId},
        process.env.ACCESS_SECRET,
        {expiresIn:process.env.ACCESS_TOKEN_TIME})
}

export function generateRefreshToken(userId,sessionId){
    return jwt.sign({id:userId,sid:sessionId},
        process.env.REFRESH_SECRET,
        {expiresIn:process.env.REFRESH_TOKEN_TIME})
}


export function verifyToken(token ,secret){
   return jwt.verify(token,secret);

}


export function clearRefreshCookie(res) {
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/"
    });
}
