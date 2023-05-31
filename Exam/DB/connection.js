import mongoose from "mongoose";

export const connectDB = async() => {
    return await mongoose.connect('mongodb://localhost:27017/Exam').then((result) => {
        console.log("connect DB...........");
    }).catch((error) => {
        console.log("failed to connnect to DB", error);
    })
}