import { userModel } from "./../../../DB/models/user.model.js";
import { productModel } from "./../../../DB/models/product.model.js";

export const addProduct = async (req, res) => {
  try {
    const { title, description, price } = req.body;
    const newProduct = new productModel({
      title,
      description,
      price,
      createdBy: req.user._id,
    });
    const savedProduct = await newProduct.save();
    res.status(200).json({ message: "Done", savedProduct });
  } catch (error) {
    res.status(400).json({ message: "catch error", error });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { title, description, price } = req.body;
    const { id } = req.params;
    const updateProduct = await productModel
      .findOneAndUpdate(
        { _id: id, createdBy: req.user._id },
        { title, description, price },
        { new: true }
      )
      .select("title description price");
    updateProduct
      ? res.status(200).json({ message: "Done", updateProduct })
      : res
        .status(400)
        .json({ message: "Invalid product id or u aren't authorized" });
  } catch (error) {
    res.status(400).json({ message: "catch error", error });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updateProduct = await productModel.deleteOne({
      _id: id,
      createdBy: req.user._id,
    });
    updateProduct
      ? res.status(200).json({ message: "Done" })
      : res
        .status(400)
        .json({ message: "Invalid product id or u aren't authorized" });
  } catch (error) {
    res.status(400).json({ message: "catch error", error });
  }
};

export const softDeleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updateProduct = await productModel.updateOne(
      { _id: id, createdBy: req.user._id },
      { isDeleted: true }
    );
    updateProduct.modifiedCount
      ? res.status(200).json({ message: "Done" })
      : res
        .status(400)
        .json({ message: "Invalid product id or u aren't authorized" });
  } catch (error) {
    res.status(400).json({ message: "catch error", error });
  }
};

export const getProductByID = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productModel.findById(id).populate([
      {
        path: "likes",
        select: "firstName lastName email",
      },
      {
        path: "createdBy",
        select: "firstName lastName email",
      },
      {
        path: "comments",
        select: "commentBody",
        match: {isDeleted: false}
      }
    ]);
    if (!product.isDeleted) {
      res.status(200).json({ message: "Done", product });
    } else {
      res.status(404).json({ message: "Invalid product ID" });
    }
  } catch (error) {
    res.status(400).json({ message: "catch error", error });
  }
};

export const getProductByTitle = async (req, res) => {
  try {
    const { title } = req.query;
    const products = await productModel.find({ title: { $regex: `${title}` } });
    products.length
      ? res.status(200).json({ message: "Done", products })
      : res.status(404).json({ message: "Not found" });
  } catch (error) {
    res.status(400).json({ message: "catch error", error });
  }
};

export const likeProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productModel.findOne({ isDeleted: false, _id: id });
    if (product) {
      if (
        JSON.stringify(product.createdBy) != JSON.stringify(req.user._id) &&
        !product.likes.includes(req.user._id)
      ) {
        const updateLikes = await productModel
          .findByIdAndUpdate(
            { _id: id },
            { $push: { likes: req.user._id } },
            { new: true }
          )
          .populate([
            {
              path: "likes",
              select: "firstName lastName email",
            },
            {
              path: "createdBy",
              select: "firstName lastName email",
            },
          ]);
        updateLikes
          ? res.status(200).json({ message: "Done", updateLikes })
          : res.status(400).json({ message: "Fail" });
      } else {
        res.status(400).json({ message: "Like is failed" });
      }
    } else {
      res.status(404).json({ message: "Invalid product ID" });
    }
  } catch (error) {
    res.status(400).json({ message: "catch error", error });
    console.log(error);
  }
};

export const unLikeProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productModel.findOne({ isDeleted: false, _id: id });
    if (product) {
      if (product.likes.includes(req.user._id)) {
        const updateLikes = await productModel
          .findByIdAndUpdate(
            { _id: id },
            { $pull: { likes: req.user._id } },
            { new: true }
          )
          .populate([
            {
              path: "likes",
              select: "firstName lastName email",
            },
            {
              path: "createdBy",
              select: "firstName lastName email",
            },
          ]);
        updateLikes
          ? res.status(200).json({ message: "Done", updateLikes })
          : res.status(400).json({ message: "Fail" });
      } else {
        res.status(400).json({ message: "Unlike is failed" });
      }
    } else {
      res.status(404).json({ message: "Invalid product ID" });
    }
  } catch (error) {
    res.status(400).json({ message: "catch error", error });
    console.log(error);
  }
};

export const getProducts = async(req, res) => {
  try {
    const products = await productModel.find({}).populate([
      {
        path: "likes",
        select: "firstName lastName",
      },
      {
        path: "createdBy",
        select: "firstName lastName",
      },
      {
        path: "comments",
        select: "commentBody createdBy",
        populate: {
          path: 'createdBy',
          select: 'firstName lastName'
        },
        match: {isDeleted: false}
      }
    ]).select('-isDeleted');
    products.length? res.status(200).json({message: "Done", products}) : res.status(404).json({message: "Empty"});
  } catch (error) {
    res.status(400).json({message: "catch error", error})
  }
}
