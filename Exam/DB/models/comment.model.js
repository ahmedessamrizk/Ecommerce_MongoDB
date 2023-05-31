import mongoose  from "mongoose";

const commentSchema = new mongoose.Schema({
    commentBody: {type: String, required: true},
    productID: {type: mongoose.Types.ObjectId, ref: 'Product'},
    createdBy: {type: mongoose.Types.ObjectId, ref: 'User', required: true},
    deletedBy: {type: mongoose.Types.ObjectId, ref: 'User'},
    isDeleted: {type: Boolean, default: false}
})

export const commentModel = mongoose.model('Comment', commentSchema);