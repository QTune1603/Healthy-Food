import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { blogService } from '../../services';

const BlogDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Mapping để hiển thị tên category đẹp hơn
  const categoryMapping = {
    'potatoes': 'Khoai Tây',
    'vegetables': 'Rau Củ', 
    'mushrooms': 'Nấm',
    'fruits': 'Trái Cây',
    'grains': 'Ngũ Cốc',
    'proteins': 'Protein',
    'dairy': 'Sản Phẩm Sữa',
    'nuts': 'Hạt',
    'herbs': 'Thảo Mộc',
    'beverages': 'Đồ Uống',
    'snacks': 'Đồ Ăn Vặt',
    'desserts': 'Tráng Miệng',
    'vegetarian': 'Món Chay',
    'organic': 'Thực Phẩm Hữu Cơ',
    'superfood': 'Siêu Thực Phẩm',
    'vitamins': 'Vitamin & Khoáng Chất',
    'diet': 'Chế Độ Ăn Uống'
  };

  // Fetch post data từ API
  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const response = await blogService.getPostById(id);
      
      if (response.success) {
        setPost(response.data);
        // Fetch related posts cùng category
        await fetchRelatedPosts(response.data.category);
      }
    } catch (error) {
      setError(error.message);
      console.error('Error fetching post:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedPosts = async (category) => {
    try {
      const response = await blogService.getPostsByCategory(category);
      if (response.success) {
        // Lọc bỏ post hiện tại và chỉ lấy 3 posts
        const filtered = response.data.posts
          .filter(p => p._id !== id)
          .slice(0, 3);
        setRelatedPosts(filtered);
      }
    } catch (error) {
      console.error('Error fetching related posts:', error);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3C493F] mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-light text-[#3C493F] mb-2">
            Có lỗi xảy ra
          </h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={fetchPost}
            className="px-6 py-2 bg-[#3C493F] text-white rounded-lg hover:bg-[#3C493F]/80 transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  // Nếu không có post
  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-xl font-light text-[#3C493F] mb-2">
            Không tìm thấy bài viết
          </h3>
          <p className="text-gray-600 mb-4">Bài viết này có thể đã bị xóa hoặc không tồn tại.</p>
          <Link 
            to="/blog"
            className="px-6 py-2 bg-[#3C493F] text-white rounded-lg hover:bg-[#3C493F]/80 transition-colors"
          >
            Quay lại Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center text-sm text-gray-500">
            <Link to="/blog" className="hover:text-[#3C493F] transition-colors">
              Trang Chủ
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-500">{post.parentCategory}</span>
            <span className="mx-2">/</span>
            <span className="text-[#3C493F]">{post.title}</span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative h-[60vh] overflow-hidden">
        <img
          src={post.image || 'https://images.unsplash.com/photo-1490645935967-10de6ba17061'}
          alt={post.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="max-w-2xl">
              <div className="mb-4 flex items-center space-x-4">
                <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm">
                  {categoryMapping[post.category] || post.category}
                </span>
                <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm">
                  {post.parentCategory}
                </span>
                {post.isFeatured && (
                  <span className="bg-[#3C493F] px-3 py-1 rounded-full text-white text-sm">
                    Nổi bật
                  </span>
                )}
              </div>
              <h1 className="text-5xl font-extralight text-white mb-4">{post.title}</h1>
              <p className="text-xl text-white/90 leading-relaxed">
                {post.excerpt || post.content.substring(0, 120) + '...'}
              </p>
              <div className="mt-6 flex items-center space-x-6 text-white/80 text-sm">
                <div className="flex items-center">
                  <span className="mr-2">👁️</span>
                  <span>{post.views || 0} lượt xem</span>
                </div>
                <div className="flex items-center">
                  <span className="mr-2">❤️</span>
                  <span>{post.likes?.length || 0} lượt thích</span>
                </div>
                <div className="flex items-center">
                  <span className="mr-2">📅</span>
                  <span>{new Date(post.createdAt).toLocaleDateString('vi-VN')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Main Content */}
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <h2 className="text-2xl font-light text-[#3C493F] mb-6">Nội Dung Chi Tiết</h2>
              <div className="prose prose-lg max-w-none">
                <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {post.content}
                </div>
              </div>
            </div>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="bg-white rounded-2xl p-8 shadow-sm">
                <h2 className="text-2xl font-light text-[#3C493F] mb-6">Thẻ</h2>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag, index) => (
                    <span 
                      key={index} 
                      className="px-3 py-1 bg-[#3C493F]/10 text-[#3C493F] rounded-full text-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Nutrition Info */}
            {post.nutritionInfo && Object.keys(post.nutritionInfo).some(key => post.nutritionInfo[key] > 0) && (
              <div className="bg-white rounded-2xl p-8 shadow-sm">
                <h2 className="text-2xl font-light text-[#3C493F] mb-6">Thông Tin Dinh Dưỡng</h2>
                <div className="mb-4">
                  <span className="text-sm text-gray-600">Khẩu phần: {post.servingSize}</span>
                </div>
                <div className="space-y-4">
                  {post.nutritionInfo.calories > 0 && (
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div className="flex-1">
                        <div className="font-medium text-[#3C493F] mb-1">Calo</div>
                        <div className="text-sm text-gray-600">{post.nutritionInfo.calories} kcal</div>
                      </div>
                    </div>
                  )}
                  {post.nutritionInfo.protein > 0 && (
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div className="flex-1">
                        <div className="font-medium text-[#3C493F] mb-1">Protein</div>
                        <div className="text-sm text-gray-600">{post.nutritionInfo.protein}g</div>
                      </div>
                    </div>
                  )}
                  {post.nutritionInfo.carbs > 0 && (
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div className="flex-1">
                        <div className="font-medium text-[#3C493F] mb-1">Carbohydrate</div>
                        <div className="text-sm text-gray-600">{post.nutritionInfo.carbs}g</div>
                      </div>
                    </div>
                  )}
                  {post.nutritionInfo.fat > 0 && (
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div className="flex-1">
                        <div className="font-medium text-[#3C493F] mb-1">Chất Béo</div>
                        <div className="text-sm text-gray-600">{post.nutritionInfo.fat}g</div>
                      </div>
                    </div>
                  )}
                  {post.nutritionInfo.fiber > 0 && (
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div className="flex-1">
                        <div className="font-medium text-[#3C493F] mb-1">Chất Xơ</div>
                        <div className="text-sm text-gray-600">{post.nutritionInfo.fiber}g</div>
                      </div>
                    </div>
                  )}
                  {post.nutritionInfo.sugar > 0 && (
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div className="flex-1">
                        <div className="font-medium text-[#3C493F] mb-1">Đường</div>
                        <div className="text-sm text-gray-600">{post.nutritionInfo.sugar}g</div>
                      </div>
                    </div>
                  )}
                  {post.nutritionInfo.sodium > 0 && (
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div className="flex-1">
                        <div className="font-medium text-[#3C493F] mb-1">Natri</div>
                        <div className="text-sm text-gray-600">{post.nutritionInfo.sodium}mg</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Quick Stats */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-light text-[#3C493F] mb-4">Thông Tin Nhanh</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Danh mục</span>
                    <span className="font-medium text-[#3C493F]">
                      {categoryMapping[post.category] || post.category}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Nhóm</span>
                    <span className="font-medium text-[#3C493F]">{post.parentCategory}</span>
                  </div>
                  {post.nutritionInfo?.calories > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Calo</span>
                      <span className="font-medium text-[#3C493F]">{post.nutritionInfo.calories} kcal</span>
                    </div>
                  )}
                  {post.nutritionInfo?.protein > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Protein</span>
                      <span className="font-medium text-[#3C493F]">{post.nutritionInfo.protein}g</span>
                    </div>
                  )}
                  {post.nutritionInfo?.carbs > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Carbs</span>
                      <span className="font-medium text-[#3C493F]">{post.nutritionInfo.carbs}g</span>
                    </div>
                  )}
                  {post.nutritionInfo?.fat > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Chất béo</span>
                      <span className="font-medium text-[#3C493F]">{post.nutritionInfo.fat}g</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Lượt xem</span>
                    <span className="font-medium text-[#3C493F]">{post.views || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Lượt thích</span>
                    <span className="font-medium text-[#3C493F]">{post.likes?.length || 0}</span>
                  </div>
                </div>
              </div>

              {/* Author Info */}
              {post.author && (
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <h3 className="text-lg font-light text-[#3C493F] mb-4">Tác Giả</h3>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-[#3C493F] rounded-full flex items-center justify-center">
                      <span className="text-white font-medium">
                        {post.author.fullName?.charAt(0) || 'A'}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium text-[#3C493F]">
                        {post.author.fullName || 'Admin'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {post.author.role || 'Tác giả'}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Related Posts */}
              {relatedPosts.length > 0 && (
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <h3 className="text-lg font-light text-[#3C493F] mb-4">Bài Viết Liên Quan</h3>
                  <div className="space-y-4">
                    {relatedPosts.map((relatedPost) => (
                      <Link
                        key={relatedPost._id}
                        to={`/blog/${relatedPost._id}`}
                        className="group block"
                      >
                        <div className="flex items-start space-x-3">
                          <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                            <img
                              src={relatedPost.image || 'https://images.unsplash.com/photo-1490645935967-10de6ba17061'}
                              alt={relatedPost.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-[#3C493F] group-hover:text-[#3C493F]/70 transition-colors line-clamp-2">
                              {relatedPost.title}
                            </h4>
                            <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                              {relatedPost.excerpt || relatedPost.content.substring(0, 60) + '...'}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail; 