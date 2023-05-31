import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstName:{ type: String, required: true },
    lastName: { type: String , required: true},
    email: { type: String , required: true, unique: true},
    password: { type: String , required: true},
    confirmEmail: { type: Boolean , default: false},
    age: Number,
    phone: String,
    isOnline: { type: Boolean , default: false},
    lastSeen: { type: Date },
    gender: {type: String, enum:['Male', 'Female'], default: 'Male'},
    role: {type: String, enum:['User', 'Admin'], default: 'User'},
    address: String,
    isDeleted: {type: Boolean, default: false},
    isBlocked: {type: Boolean, default: false},
    code: {type: String, default: null}

},
{
    timestamps: true 
})

export const userModel = mongoose.model('User', userSchema);