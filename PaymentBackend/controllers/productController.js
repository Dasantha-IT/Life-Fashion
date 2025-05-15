import { v2 as cloudinary } from "cloudinary";
import productModel from "../models/productModel.js";
import { response } from "express";

// function for add product
const addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      subCategory,
      sizes,
      bestseller,
      quantity,
    } = req.body;

    // Basic validations
    if (!name || !description || !category || !price || !sizes || !quantity) {
      return res.status(400).json({
        success: false,
        message:
          "Name, description, category, price, quantity, and sizes are required.",
      });
    }

    if (isNaN(price) || Number(price) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Price must be a positive number.",
      });
    }

    if (isNaN(quantity) || Number(quantity) < 0) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be a non-negative number.",
      });
    }

    let parsedSizes;
    try {
      parsedSizes = JSON.parse(sizes);
      if (!Array.isArray(parsedSizes) || parsedSizes.length === 0) {
        throw new Error();
      }
    } catch {
      return res.status(400).json({
        success: false,
        message: "Sizes must be a valid non-empty array.",
      });
    }

    const image1 = req.files.image1 && req.files.image1[0];
    const image2 = req.files.image2 && req.files.image2[0];
    const image3 = req.files.image3 && req.files.image3[0];
    const image4 = req.files.image4 && req.files.image4[0];

    const images = [image1, image2, image3, image4].filter(Boolean);

    if (images.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one image is required to add the product.",
      });
    }

    const imagesUrl = await Promise.all(
      images.map(async (item) => {
        const result = await cloudinary.uploader.upload(item.path, {
          resource_type: "image",
        });
        return result.secure_url;
      })
    );

    const productData = {
      name,
      description,
      category,
      price: Number(price),
      subCategory,
      bestseller: bestseller === "true",
      sizes: parsedSizes,
      image: imagesUrl,
      date: Date.now(),
      quantity: Number(quantity),
    };

    const product = new productModel(productData);
    await product.save();

    res.json({ success: true, message: "Product Added" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Function to update product details
const updateProduct = async (req, res) => {
  try {
    const {
      id,
      name,
      description,
      price,
      category,
      bestseller,
      sizes,
      quantity,
    } = req.body;

    // Validate required fields
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required.",
      });
    }

    // Basic validations
    if (!name || !description || !category || !price || !sizes || !quantity) {
      return res.status(400).json({
        success: false,
        message:
          "Name, description, category, price, quantity, and sizes are required.",
      });
    }

    if (isNaN(price) || Number(price) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Price must be a positive number.",
      });
    }

    if (isNaN(quantity) || Number(quantity) < 0) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be a non-negative number.",
      });
    }

    // Validate and parse sizes
    let parsedSizes;
    try {
      parsedSizes = Array.isArray(sizes) ? sizes : JSON.parse(sizes);
      if (!Array.isArray(parsedSizes) || parsedSizes.length === 0) {
        throw new Error();
      }
    } catch {
      return res.status(400).json({
        success: false,
        message: "Sizes must be a valid non-empty array.",
      });
    }

    const updatedProduct = await productModel.findByIdAndUpdate(
      id,
      {
        name,
        description,
        category,
        price: Number(price),
        bestseller: bestseller === "true",
        sizes: parsedSizes,
        quantity: Number(quantity),
      },
      { new: true } // Return the updated document
    );

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    res.json({
      success: true,
      message: "Product updated successfully.",
      product: updatedProduct,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// function for list product
const listProducts = async (req, res) => {
  try {
    const products = await productModel.find({});
    res.json({ success: true, products });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// function for removing product
const removeProduct = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "Product removed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// function for single product info
const singleProduct = async (req, res) => {
  try {
    const { productId } = req.body;
    const product = await productModel.findById(productId);
    res.json({ success: true, product });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export {
  listProducts,
  addProduct,
  updateProduct,
  removeProduct,
  singleProduct,
};
