import { userModel } from './../DB/models/user.model.js';

export const checkProfile = () => {
    return async(req,res,next) => {
        try {
            const user = await userModel.findById(req.user._id);
            user.age && user.phone && user.gender && user.address? next() : res.status(401).json({message: "Please complete ur profile data"});
        } catch (error) {
            res.status(400).json({message: "catch error", error});
        }
    }
}