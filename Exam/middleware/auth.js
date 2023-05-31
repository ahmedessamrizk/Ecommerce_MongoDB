import dotenv from 'dotenv'
dotenv.config()
import jwt from 'jsonwebtoken'
import { userModel } from './../DB/models/user.model.js';

export const auth = () => {
    return async(req, res, next) => {
        try {
            const { authorization } = req.headers;
            if (!authorization?.startsWith(process.env.Bearer)) {
                res.status(400).json({message: "Invalid Bearer"});
            } else {
                const token = authorization.split('__')[1];
                const decoded = jwt.verify(token, process.env.emailToken);
                if (!decoded?.id) {
                    res.status(400).json({message: "Invalid payload data"});
                } else {
                    const user = await userModel.findById(decoded.id).select('firstName lastName isDeleted isBlocked');
                    if (!user) {
                        res.status(404).json({message: "Invalid ID"});
                    } else {
                        if (user.isDeleted || user.isBlocked) {
                            res.status(401).json({message: "Account has been blocked or deleted"});
                        } else {
                            req.user = user;
                            next();
                        }
                    }
                }
            }
        } catch (error) {
            res.status(400).json({message: "catch error", error});
        }
    }
}