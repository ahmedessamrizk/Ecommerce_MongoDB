import mongoose  from "mongoose";

const productSchema = new mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    price: {type: Number, required: true},
    likes: [{ type : mongoose.Types.ObjectId, ref: 'User' ,default:[]}],
    comments: [{ type : mongoose.Types.ObjectId, ref: 'Comment' }],
    createdBy: {type: mongoose.Types.ObjectId, ref: 'User', required: true},
    isDeleted: {type: Boolean, default: false}
})

export const productModel = mongoose.model('Product', productSchema);