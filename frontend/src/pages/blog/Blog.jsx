import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { blogService } from '../../services';

const Blog = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
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

  const parentCategoryMapping = {
    'Thực Phẩm Cơ Bản': '🥬',
    'Món Ăn Đặc Biệt': '🍽️',
    'Thông Tin Dinh Dưỡng': '📊'
  };

  // Fetch posts và categories từ API
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [selectedCategory]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await blogService.getAllPosts();
      
      if (response.success) {
        const allPosts = response.data.posts || [];
        setPosts(allPosts);
        
        // Tạo categories từ dữ liệu posts
        const categoriesData = generateCategoriesFromPosts(allPosts);
        setCategories(categoriesData);
      }
    } catch (error) {
      setError(error.message);
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPosts = async () => {
    try {
      setLoading(true);
      let response;
      
      if (selectedCategory === 'all') {
        response = await blogService.getAllPosts();
      } else {
        response = await blogService.getPostsByCategory(selectedCategory);
      }
      
      if (response.success) {
        setPosts(response.data.posts || []);
      }
    } catch (error) {
      setError(error.message);
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateCategoriesFromPosts = (posts) => {
    // Nhóm posts theo parentCategory
    const groupedByParent = posts.reduce((acc, post) => {
      const parent = post.parentCategory;
      if (!acc[parent]) {
        acc[parent] = [];
      }
      acc[parent].push(post);
      return acc;
    }, {});

    // Tạo structure categories từ dữ liệu thực
    return Object.keys(groupedByParent).map(parentCategory => {
      const postsInParent = groupedByParent[parentCategory];
      
      // Nhóm theo category con
      const childCategories = postsInParent.reduce((acc, post) => {
        const category = post.category;
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(post);
        return acc;
      }, {});

      return {
        id: parentCategory.toLowerCase().replace(/\s+/g, '-'),
        title: parentCategory,
        description: getParentCategoryDescription(parentCategory),
        icon: parentCategoryMapping[parentCategory] || '📋',
        children: Object.keys(childCategories).map(category => ({
          id: category,
          title: categoryMapping[category] || category,
          image: childCategories[category][0]?.image || 'https://images.unsplash.com/photo-1490645935967-10de6ba17061',
          description: getChildCategoryDescription(category),
          count: `${childCategories[category].length} bài viết`,
          posts: childCategories[category]
        }))
      };
    });
  };

  const getParentCategoryDescription = (parentCategory) => {
    const descriptions = {
      'Thực Phẩm Cơ Bản': 'Các loại thực phẩm thiết yếu hàng ngày',
      'Món Ăn Đặc Biệt': 'Những món ăn có tính chất đặc biệt',
      'Thông Tin Dinh Dưỡng': 'Kiến thức về dinh dưỡng và sức khỏe'
    };
    return descriptions[parentCategory] || 'Danh mục đặc biệt';
  };

  const getChildCategoryDescription = (category) => {
    const descriptions = {
      'potatoes': 'Khoai tây là nguồn cung cấp chất xơ và các chất dinh dưỡng thiết yếu cho cơ thể',
      'vegetables': 'Rau củ giàu vitamin, khoáng chất và chất xơ, giúp tăng cường sức khỏe',
      'mushrooms': 'Nấm giúp bảo vệ sức khỏe tim mạch và tăng cường hệ miễn dịch',
      'vegetarian': 'Khám phá thế giới ẩm thực chay phong phú và bổ dưỡng',
      'organic': 'Thực phẩm hữu cơ được trồng và chế biến theo phương pháp tự nhiên',
      'superfood': 'Những thực phẩm có giá trị dinh dưỡng đặc biệt cao',
      'vitamins': 'Tìm hiểu về các vitamin và khoáng chất thiết yếu',
      'diet': 'Hướng dẫn xây dựng chế độ ăn uống khoa học'
    };
    return descriptions[category] || 'Danh mục thực phẩm tốt cho sức khỏe';
  };

  const getAllItems = () => {
    return categories.flatMap(category => category.children);
  };

  const getFilteredItems = () => {
    if (selectedCategory === 'all') {
      return getAllItems();
    }
    const category = categories.find(cat => cat.id === selectedCategory);
    if (category) {
      return category.children;
    }
    // Tìm trong children
    const allItems = getAllItems();
    return allItems.filter(item => item.id === selectedCategory);
  };

  const filteredItems = getFilteredItems();
  const featuredItem = filteredItems[0];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-extralight text-[#3C493F] mb-6">
              Khám Phá Ẩm Thực
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Hành trình khám phá những món ăn lành mạnh và bổ dưỡng
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
      </div>

      {/* Categories Navigation */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-6 py-3 rounded-full transition-all duration-300 ${
                selectedCategory === 'all'
                  ? 'bg-[#3C493F] text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <span className="mr-2">🍽️</span>
              Tất Cả
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 rounded-full transition-all duration-300 ${
                  selectedCategory === category.id
                    ? 'bg-[#3C493F] text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <span className="mr-2">{category.icon}</span>
                {category.title}
              </button>
            ))}
            {/* Sub-categories */}
            {getAllItems().map((item) => (
              <button
                key={item.id}
                onClick={() => setSelectedCategory(item.id)}
                className={`px-6 py-3 rounded-full transition-all duration-300 ${
                  selectedCategory === item.id
                    ? 'bg-[#3C493F] text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {item.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Category Description */}
        {selectedCategory !== 'all' && (
          <div className="mb-12 text-center">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-3xl font-light text-[#3C493F] mb-4">
                {categories.find(cat => cat.id === selectedCategory)?.title || 
                 getAllItems().find(item => item.id === selectedCategory)?.title}
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {categories.find(cat => cat.id === selectedCategory)?.description ||
                 getAllItems().find(item => item.id === selectedCategory)?.description}
              </p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3C493F]"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">⚠️</div>
            <h3 className="text-xl font-light text-[#3C493F] mb-2">
              Có lỗi xảy ra
            </h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={fetchData}
              className="px-6 py-2 bg-[#3C493F] text-white rounded-lg hover:bg-[#3C493F]/80 transition-colors"
            >
              Thử lại
            </button>
          </div>
        )}

        {/* Posts Grid */}
        {!loading && !error && posts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Link key={post._id} to={`/blog/${post._id}`} 
                    className="group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500">
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={post.image || 'https://images.unsplash.com/photo-1490645935967-10de6ba17061'}
                    alt={post.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center justify-between text-white text-sm">
                      <span className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded">
                        {categoryMapping[post.category] || post.category}
                      </span>
                      <span className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded">
                        {post.views || 0} lượt xem
                      </span>
                    </div>
                  </div>
                  {post.isFeatured && (
                    <div className="absolute top-4 left-4">
                      <span className="bg-[#3C493F] text-white px-2 py-1 rounded text-xs">
                        Nổi bật
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <div className="mb-2">
                    <span className="text-xs text-gray-500">
                      {post.parentCategory}
                    </span>
                  </div>
                  <h3 className="text-xl font-light text-[#3C493F] mb-3 group-hover:text-[#3C493F]/70 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
                    {post.excerpt || post.content?.substring(0, 100) + '...'}
                  </p>
                  <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                    <span>{post.likes?.length || 0} lượt thích</span>
                    <span>{new Date(post.createdAt).toLocaleDateString('vi-VN')}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && posts.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🍽️</div>
            <h3 className="text-xl font-light text-[#3C493F] mb-2">
              Chưa có bài viết nào
            </h3>
            <p className="text-gray-600">
              Danh mục này hiện tại chưa có bài viết nào. Vui lòng quay lại sau!
            </p>
          </div>
        )}

        {/* Stats Section */}
        {!loading && categories.length > 0 && (
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-light text-[#3C493F] mb-2">
                {getAllItems().reduce((sum, item) => sum + (item.posts?.length || 0), 0)}
              </div>
              <div className="text-sm text-gray-500">Bài Viết</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-light text-[#3C493F] mb-2">{categories.length}</div>
              <div className="text-sm text-gray-500">Danh Mục Chính</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-light text-[#3C493F] mb-2">
                {getAllItems().length}
              </div>
              <div className="text-sm text-gray-500">Danh Mục Con</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-light text-[#3C493F] mb-2">24/7</div>
              <div className="text-sm text-gray-500">Hỗ Trợ</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog; 