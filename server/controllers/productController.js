const Product = require('../models/Product');

// POST /api/products  (protected)
exports.createProduct = async (req, res) => {
  try {
    const { name, price, quantity, image, notes, category, location } = req.body;
    if (!name || !price || !quantity) return res.status(400).json({ message: 'name, price and quantity required' });

    // role-based authorization: only farmers may create products
    if (!req.user || req.user.role !== 'farmer') {
      return res.status(403).json({ message: 'Only farmers can create products' });
    }

    // If a file was uploaded via multer, use its path as image
    let imagePath = image;
    if (req.file) {
      // expose via /uploads
      imagePath = '/uploads/' + req.file.filename;
    }

    const product = new Product({ name, price, quantity, image: imagePath, notes, category, location, ownerId: req.user.id });
    await product.save();
    // populate owner name for client convenience
    await product.populate('ownerId', 'name phone');
    res.status(201).json({ product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/products/mine (protected)
exports.getMyProducts = async (req, res) => {
  try {
    const products = await Product.find({ ownerId: req.user.id }).sort({ createdAt: -1 }).populate('ownerId', 'name phone');
    res.json({ products });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// PUT /api/products/:id (protected)
exports.updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findOne({ _id: productId, ownerId: req.user.id });
    if (!product) return res.status(404).json({ message: 'Product not found or not owned by user' });

    const { name, price, quantity, image, notes, category, location } = req.body;
    if (name !== undefined) product.name = name;
    if (price !== undefined) product.price = price;
    if (quantity !== undefined) product.quantity = quantity;
    if (notes !== undefined) product.notes = notes;
    if (category !== undefined) product.category = category;
    if (location !== undefined) product.location = location;

    if (req.file) {
      product.image = '/uploads/' + req.file.filename;
    } else if (image !== undefined) {
      product.image = image;
    }

    await product.save();
    await product.populate('ownerId', 'name phone');
    res.json({ product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// DELETE /api/products/:id (protected)
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({ _id: req.params.id, ownerId: req.user.id });
    if (!product) return res.status(404).json({ message: 'Product not found or not owned by user' });
    res.json({ message: 'Product deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/products (public) - list all products
// GET /api/products (public) - list all products from ALL farmers
exports.getAllProducts = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page || '1', 10), 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit || '12', 10), 1), 50);
    const q = (req.query.q || '').trim();
    const minPrice = req.query.minPrice ? parseFloat(req.query.minPrice) : null;
    const maxPrice = req.query.maxPrice ? parseFloat(req.query.maxPrice) : null;
    const category = (req.query.category || '').trim();
    const location = (req.query.location || '').trim();
    const owner = (req.query.owner || '').trim();

    // Build filter (NO owner filter by default - show ALL products)
    const filter = {};
    if (q) {
      filter.$or = [
        { name: { $regex: q, $options: 'i' } },
        { notes: { $regex: q, $options: 'i' } }
      ];
    }
    if (minPrice !== null && !isNaN(minPrice)) filter.price = { ...filter.price, $gte: minPrice };
    if (maxPrice !== null && !isNaN(maxPrice)) filter.price = { ...filter.price, $lte: maxPrice };
    if (category) filter.category = { $regex: category, $options: 'i' };
    if (location) filter.location = { $regex: location, $options: 'i' };

    const skip = (page - 1) * limit;
    let products = [];
    let total = 0;

    // If searching by owner name, use aggregation with lookup
    if (owner) {
      const lookupPipeline = [
        { $lookup: { from: 'users', localField: 'ownerId', foreignField: '_id', as: 'ownerInfo' } },
        { $unwind: { path: '$ownerInfo', preserveNullAndEmptyArrays: true } },
        { $match: { ...filter, 'ownerInfo.name': { $regex: owner, $options: 'i' } } },
        { $facet: {
            total: [{ $count: 'count' }],
            data: [
              { $sort: { createdAt: -1 } },
              { $skip: skip },
              { $limit: limit },
              { $addFields: { ownerId: '$ownerInfo' } },
              { $project: { ownerInfo: 0, 'ownerId.password': 0, 'ownerId.refreshTokens': 0, 'ownerId.email': 0 } }
            ]
          }
        }
      ];
      const result = await Product.aggregate(lookupPipeline);
      total = result[0]?.total[0]?.count || 0;
      products = result[0]?.data || [];
    } else {
      // Normal query - return ALL products with populated owner (including phone)
      total = await Product.countDocuments(filter);
      products = await Product.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('ownerId', 'name phone');   // ✅ critical: includes phone number
    }

    const totalPages = Math.ceil(total / limit) || 1;
    res.json({ products, page, limit, totalPages, total });
  } catch (err) {
    console.error('Error in getAllProducts:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};