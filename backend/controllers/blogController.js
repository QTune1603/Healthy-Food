const BlogPost = require('../models/BlogPost');

// @desc    Lấy tất cả bài viết
// @route   GET /api/blog
// @access  Public
const getAllPosts = async (req, res) => {
  try {
    let { category, parentCategory, search, page = 1, limit = 10 } = req.query;
    
    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const limitNum = Math.max(parseInt(limit, 10) || 10, 1);

    const query = { isPublished: true };

    if (category) query.category = new RegExp(`^${category}$`, 'i');
    if (parentCategory) query.parentCategory = new RegExp(`^${parentCategory}$`, 'i');
    if (search) query.$text = { $search: search };

    const startTime = Date.now();

    // Count & Fetch song song
    const [total, posts] = await Promise.all([
      BlogPost.countDocuments(query),
      BlogPost.find(query)
        .collation({ locale: 'en', strength: 2 })
        .populate('author', 'fullName avatar')
        .sort({ isFeatured: -1, createdAt: -1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum)
    ]);

    console.log(`Query done in ${Date.now() - startTime}ms`);

    res.json({
      success: true,
      data: {
        posts,
        totalPages: Math.ceil(total / limitNum),
        currentPage: pageNum,
        hasNextPage: pageNum < Math.ceil(total / limitNum),
        total
      }
    });

  } catch (error) {
    console.error("❌ Error in getAllPosts:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAllPosts };

// @desc    Lấy bài viết theo ID
// @route   GET /api/blog/:id
// @access  Public
const getPostById = async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id)
      .populate('author', 'fullName avatar');
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy bài viết'
      });
    }
    
    // Tăng số lượt xem
    post.views += 1;
    await post.save();
    
    res.json({
      success: true,
      data: post
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Tạo bài viết mới
// @route   POST /api/blog
// @access  Private
const createPost = async (req, res) => {
  try {
    const postData = {
      ...req.body,
      author: req.user.id
    };
    
    const post = await BlogPost.create(postData);
    
    res.status(201).json({
      success: true,
      data: post
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Cập nhật bài viết
// @route   PUT /api/blog/:id
// @access  Private
const updatePost = async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy bài viết'
      });
    }
    
    // Kiểm tra quyền sở hữu
    if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Không có quyền cập nhật bài viết này'
      });
    }
    
    const updatedPost = await BlogPost.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    res.json({
      success: true,
      data: updatedPost
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Xóa bài viết
// @route   DELETE /api/blog/:id
// @access  Private
const deletePost = async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy bài viết'
      });
    }
    
    // Kiểm tra quyền sở hữu
    if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Không có quyền xóa bài viết này'
      });
    }
    
    await BlogPost.findByIdAndDelete(req.params.id);
    
    res.json({
      success: true,
      message: 'Xóa bài viết thành công'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Like/Unlike bài viết
// @route   PUT /api/blog/:id/like
// @access  Private
const toggleLike = async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy bài viết'
      });
    }
    
    const isLiked = post.likes.includes(req.user.id);
    
    if (isLiked) {
      // Unlike
      post.likes = post.likes.filter(id => id.toString() !== req.user.id);
    } else {
      // Like
      post.likes.push(req.user.id);
    }
    
    await post.save();
    
    res.json({
      success: true,
      data: {
        likes: post.likes.length,
        isLiked: !isLiked
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Lấy bài viết nổi bật
// @route   GET /api/blog/featured
// @access  Public
const getFeaturedPosts = async (req, res) => {
  try {
    const posts = await BlogPost.find({ 
      isPublished: true, 
      isFeatured: true 
    })
      .populate('author', 'fullName avatar')
      .sort({ createdAt: -1 })
      .limit(6);
    
    res.json({
      success: true,
      data: posts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  toggleLike,
  getFeaturedPosts
}; 