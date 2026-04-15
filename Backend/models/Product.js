const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  product_id: { type: String, required: true, unique: true, uppercase: true, trim: true },
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  category: { type: String, required: true, enum: ['ring','necklace','earring','bracelet','pendant','bangle','chain','other'], lowercase: true },
  material: { type: String, required: true, enum: ['gold','silver','platinum','rose_gold','white_gold','other'], lowercase: true },
  purity: { type: String, trim: true },
  design_style: { type: String, enum: ['traditional','modern','fusion','antique','minimalist','bridal','other'], lowercase: true },
  occasion: [{ type: String, enum: ['daily','wedding','party','festival','office','gifting'] }],
  gender: { type: String, enum: ['female','male','unisex'], default: 'female' },
  price: { type: Number, required: true, min: 0 },
  weight_grams: { type: Number, min: 0 },
  in_stock: { type: Boolean, default: true },
  tags: [{ type: String, lowercase: true, trim: true }],
  images: {
    primary:   { type: String, default: '' },
    thumbnail: { type: String, default: '' },
    gallery:   [{ type: String }],
  },
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ category: 1, material: 1, price: 1 });
productSchema.index({ in_stock: 1 });

module.exports = mongoose.model('Product', productSchema);
