import { userModel } from './../../../DB/models/user.model.js';
import  bcrypt  from 'bcryptjs';
import {encryptNumber} from 'encrypt-phone-numbers'
import { productModel } from './../../../DB/models/product.model.js';
import jwt from 'jsonwebtoken'

export const getUserByID = async(req, res) => {
    try {
        const { id } = req.params;
        const user = await userModel.findById(id).select('firstName lastName email age');
        user? res.status(200).json({message: "Done", user}) : res.status(404).json({message: "Invalid ID"});
    } catch (error) {
        res.status(400).json({message: "catch error", error});
    }
}

export const updateProfile = async(req, res) => {
    try {
        const { firstName, lastName, age, address, phone } = req.body;
        const encryptPhone = encryptNumber(phone, parseInt(process.env.encryptNumber), 'X'); 
        const user  = await userModel.findByIdAndUpdate(req.user.id, { firstName, lastName, age, address, phone:encryptPhone }, {new: true}).select('firstName lastName age address phone');
        user? res.status(200).json({message: "Done", user}) : res.status(400).json({message: "Failed to update profile"});
    } catch (error) {
        res.status(400).json({message: "catch error", error})
    }
}

export const updatePassword = async(req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const user = await userModel.findById(req.user._id);
        const match  = bcrypt.compareSync(oldPassword, user.password);
        if (match) {
            const hashPassword = bcrypt.hashSync(newPassword);
            const updateUser = await userModel.updateOne({_id: req.user._id}, {password: hashPassword});
            updateUser.modifiedCount? res.status(200).json({message: "Done"}) : res.status(400).json({message: "Failed to update password"});
        } else {
            res.status(403).json({message: "Invalid password"});
        }
    } catch (error) {
        res.status(400).json({message: "catch error", error})
    }
}

export const softDeleteProfile = async(req, res) => {
    try {
        const { password } = req.body;
        const user = await userModel.findById(req.user._id);
        const match = bcrypt.compareSync(password, user.password);
        if (match) {
            const deleteUser = await userModel.updateOne({_id: req.user._id}, {isDeleted: true});
            deleteUser? res.status(200).json({message: "Done"}) : res.status(400).json({message: "Failed to delete"})
        } else {
            res.status(403).json({message: "Invalid password"});
        }
    } catch (error) {
        res.status(400).json({message: "catch error", error})
    }
}

export const SignOut = async(req, res) => {
    try {
        const crrDate = new Date();
        const user = await userModel.findByIdAndUpdate(req.user._id,  {lastSeen: crrDate, isOnline: false}, {new: true}).select('lastSeen isOnline');
        res.status(200).json({message: "Done", user});
    } catch (error) {
        res.status(400).json({message: "catch error", error})
    }
}

export const getUsers = async(req, res) => {
    try {
        const users = await userModel.aggregate([
            {
                $lookup: {
                    from: "products",
                    localField: "_id",
                    foreignField: "createdBy",
                    as: "User_Products",
                    pipeline: [
                        {
                            $lookup: {
                                from: "comments",
                                localField: "_id",
                                foreignField: "productID",
                                as: "comments"
                            }
                        },
                        {
                            $lookup: {
                                from: "users",
                                localField: "likes",
                                foreignField: "_id",
                                as: "likes"
                            }
                        }
                    ]
                }
            }
        ])
        res.status(200).json({message: "Done", users});
    } catch (error) {
        res.status(400).json({message: "catch error", error});
        console.log(error);
    }
}

export const blockUser = async(req, res) => {
    try {
        const { email } = req.body;
        const user = await userModel.findById(req.user._id).select('role');
        if (user.role == "Admin") {
            const updateUser = await userModel.updateOne({email, isBlocked: false}, {isBlocked: true});
            updateUser.modifiedCount? res.status(200).json({message: "Done"}) : res.status(400).json({message: "Already Blocked"});
        } else {
            res.status(401).json({message: "U aren't admin"})
        }
    } catch (error) {
        res.status(400).json({message: "catch error", error})
    }
}