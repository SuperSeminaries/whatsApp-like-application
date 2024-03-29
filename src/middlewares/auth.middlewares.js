import Jwt from "jsonwebtoken";
import { User } from "../models/user.models.js";

const verifyjwt = async (req, res, next) => {
    try {
        const token = req.cookies.accessToken   || req.headers['authorization'];
        if (!token) {
            return res.status(401).json({ message: 'Authorization token is required' });
        }

        const decoded = await Jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        const user = await User.findById(decoded._id)
        if (!user) {
            res.status(401).json({ message: 'Invalid token'})
        }

        req.user = user
        return next()
        
    } catch (error) {
        console.log(error);
    }
}

export { verifyjwt }