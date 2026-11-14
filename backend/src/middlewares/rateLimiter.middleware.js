import {rateLimit} from "express-rate-limit";

export function createRateLimiter(limit,ms,message){

    return rateLimit({
        windowMs:ms,
        limit,
        standardHeaders:true,
        legacyHeaders:true,
        message:{
            message,
            success:false
        }
    })
}