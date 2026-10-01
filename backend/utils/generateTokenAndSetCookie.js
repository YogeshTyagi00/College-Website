import jwt from 'jsonwebtoken';

export const generateTokenAndSetCookie = (res,userId) => {
    const token  = jwt.sign({userId},process.env.JWT_SECRET,{
        expiresIn : "1d",
    });

    res.cookie("token",token,{
        httpOnly: true,//xss attack
        secure: process.env.COOKIE_SECURE === "true", // set COOKIE_SECURE=true only if using HTTPS with a domain
        sameSite: "lax",
        maxAge:1*24*60*60*1000
    });

    return token;
};