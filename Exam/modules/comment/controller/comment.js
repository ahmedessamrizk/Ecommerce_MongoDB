import { productModel } from './../../../DB/models/product.model.js';
import { commentModel } from './../../../DB/models/comment.model.js';

export const addComment = async(req, res) => {
    try {
        const { commentBody, productID } = req.body;
        const product = await productModel.findById(productID);
        if (product) {
            if (!product.isDeleted) {
                const newComment = new commentModel({commentBody, productID: product?._id, createdBy: req.user._id});
                const savedComment = await newComment.save();
                res.status(200).json({message: "Done", savedComment});
                await productModel.updateOne({_id: productID}, { $push: { comments: savedComment._id } })
            } else {
                res.status(404).json({message: "invalid product ID"});
            }
        } else {
            res.status(404).json({message: "invalid product ID"});
        }
    } catch (error) {
        res.status(400).json({message: "catch error", error})
        console.log(error);
    }
}

export const updateComment = async(req, res) => {
    try {
        const { commentBody } = req.body;
        const { id } = req.params;
        const updateComment = await commentModel.findOneAndUpdate({_id:id, createdBy: req.user._id}, {commentBody}, {new:true});
        updateComment? res.status(200).json({message: "Done", updateComment}) : res.status(400).json({message: "Not authorized or invalid comment ID"});
    } catch (error) {
        res.status(400).json({message: "catch error", error})
    }
}

export const softDeleteComment  = async(req, res) => {
    try {
        const { id } = req.params;
        const comment = await commentModel.findById(id);
        if (comment) {
            const product = await productModel.findById(comment.productID);
            if (JSON.stringify(req.user._id) == JSON.stringify(product?.createdBy) || JSON.stringify(req.user._id) == JSON.stringify(comment?.createdBy)) {
                    const deleteComment = await commentModel.updateOne({_id:id, isDeleted: false}, {isDeleted: true, deletedBy: req.user._id});
                    deleteComment.modifiedCount? res.status(200).json({message: "Done"}) : res.status(400).json({message: "Invalid comment ID"});
            } else {
                res.status(401).json({message: "Not authorized"});
            }
        } else {
            res.status(401).json({message: "invalid comment ID"});
        }
    } catch (error) {
        res.status(400).json({message: "catch error", error});
        console.log(error);
    }
}