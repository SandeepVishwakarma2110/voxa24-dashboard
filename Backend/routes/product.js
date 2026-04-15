const express = require('express');
const { getProducts, getProductById, createProduct, updateProduct, deleteProduct, uploadImages } = require('../controllers/productController.js');
const { upload } = require('../config/cloudinary.js');

const router = express.Router();

router.get('/',            getProducts);
router.get('/:id',         getProductById);
router.post('/',           upload.array('images', 10), createProduct);  // ← added multer here
router.put('/:id',         updateProduct);
router.delete('/:id',      deleteProduct);
router.post('/:id/images', upload.array('images', 10), uploadImages);

module.exports = router;
