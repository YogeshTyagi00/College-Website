export const authorizeRole = (role) => {
    return (req,res,next) => {
        try{
            if(req.role != role){
                return res.status(403).json({ message: "Forbidden access" });
            }
            next();
        }catch(error){
            console.error("Error authorizing role:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    };
};