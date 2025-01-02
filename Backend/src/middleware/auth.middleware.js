import jwt from 'jsonwebtoken'
import User from '../models/user.model.js'

export const protectRoute = async (req, res, next) => {
    try {
        //whenever request will come to this route comes with the header containing cookies
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(401).json({ message: "Unauthorized--No Token Provided" });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);//returns the payload (the data encoded in the token).
        if (!decoded) {
            return res.status(401).json({ message: "Unauthorized--Token is invalid" });
        }
        //which user generate this token after verification we can find him by this 
        const user = await User.findById(decoded.userId).select("-password");
        if (!user) {
            res.status(404).json({ message: "User not Found" });
        }
        req.user = user//Now request user has become to the database user
        next()
    }
    catch (error) {
        console.log("Error in protectRoute middleware :", error.message);
        res.status(500).json({ message: "Internal Server Error!" });

    }
}