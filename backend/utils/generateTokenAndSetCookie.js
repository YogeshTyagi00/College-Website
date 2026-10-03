import jwt from 'jsonwebtoken';

export const generateTokenAndSetCookie = (res,userId,role) => {
    const token  = jwt.sign(
        {userId,role},
        process.env.JWT_SECRET,
        {expiresIn : "1h"}
    );

    res.cookie("token",token,{
        httpOnly: true,//xss attack
        secure: process.env.COOKIE_SECURE === "true", // set COOKIE_SECURE=true only if using HTTPS with a domain
        sameSite: "lax",
        maxAge:60*60*1000
    });

    return token;
};