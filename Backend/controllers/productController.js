const Product = require('../models/Product.js');
const { cloudinary } = require('../config/cloudinary.js');

const getProducts = async (req, res) => {
  try {
    const { category, material, design_style, gender, occasion, in_stock, tags, min_price, max_price, search, page = 1, limit = 20, sort } = req.query;
    const filter = {};
    if (category)     filter.category = category.toLowerCase();
    if (material)     filter.material = material.toLowerCase();
    if (design_style) filter.design_style = design_style.toLowerCase();
    if (gender)       filter.gender = gender.toLowerCase();
    if (in_stock !== undefined) filter.in_stock = in_stock === 'true';
    if (occasion)     filter.occasion = { $in: occasion.split(',') };
    if (tags)         filter.tags = { $in: tags.split(',').map(t => t.toLowerCase()) };
    if (min_price || max_price) {
      filter.price = {};
      if (min_price) filter.price.$gte = Number(min_price);
      if (max_price) filter.price.$lte = Number(max_price);
    }
    if (search) filter.$text = { $search: search };
    const skip = (Number(page) - 1) * Number(limit);
    const sortObj = sort === 'price_asc' ? { price: 1 } : sort === 'price_desc' ? { price: -1 } : { created_at: -1 };
    const [products, total] = await Promise.all([
      Product.find(filter).sort(sortObj).skip(skip).limit(Number(limit)),
      Product.countDocuments(filter),
    ]);
    res.json({ success: true, total, page: Number(page), pages: Math.ceil(total / Number(limit)), products });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findOne({ product_id: req.params.id.toUpperCase() });
    if (!product) return res.status(404).json({ success: false, error: 'Product not found' });
    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const createProduct = async (req, res) => {
  try {
    const payload = {
      ...req.body,
      occasion: req.body.occasion ? JSON.parse(req.body.occasion) : [],
      tags: req.body.tags ? JSON.parse(req.body.tags) : [],
      price: Number(req.body.price),
      weight_grams: req.body.weight_grams ? Number(req.body.weight_grams) : undefined,
      in_stock: req.body.in_stock === 'true' || req.body.in_stock === true,
    }

    const product = new Product(payload)

   if (req.files && req.files.length > 0) {
  console.log('Uploaded file object:', JSON.stringify(req.files[0], null, 2)) // ← add this
  const imageUrls = req.files.map(f => f.secure_url || f.path)
  product.images.primary = imageUrls[0]
  product.images.thumbnail = imageUrls[0].replace('/upload/', '/upload/w_300,h_300,c_fill/')
  product.images.gallery = imageUrls.slice(1)
}
    await product.save()
    res.status(201).json({ success: true, product })
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, error: 'Product ID already exists' })
    }
    res.status(400).json({ success: false, error: error.message })
  }
}

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate(
      { product_id: req.params.id.toUpperCase() },
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!product) return res.status(404).json({ success: false, error: 'Product not found' });
    res.json({ success: true, product });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({ product_id: req.params.id.toUpperCase() });
    if (!product) return res.status(404).json({ success: false, error: 'Product not found' });
    res.json({ success: true, message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const uploadImages = async (req, res) => {
  try {
    const product = await Product.findOne({ product_id: req.params.id.toUpperCase() });
    if (!product) return res.status(404).json({ success: false, error: 'Product not found' });
    const files = req.files;
    if (!files || files.length === 0) return res.status(400).json({ success: false, error: 'No images uploaded' });
    const imageUrls = files.map(f => f.secure_url || f.path);
    if (!product.images.primary) {
      product.images.primary = imageUrls[0];
      product.images.gallery.push(...imageUrls.slice(1));
    } else {
      product.images.gallery.push(...imageUrls);
    }
    if (!product.images.thumbnail && product.images.primary) {
      product.images.thumbnail = product.images.primary.replace('/upload/', '/upload/w_300,h_300,c_fill/');
    }
    await product.save();
    res.json({ success: true, images: product.images });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct, uploadImages };
