import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { blogService } from '../../services';

import BlogDetailBreadcrumb from './components/BlogDetailBreadcrumb';
import BlogDetailHero from './components/BlogDetailHero';
import BlogDetailContent from './components/BlogDetailContent';
import BlogDetailSidebar from './components/BlogDetailSidebar';

const BlogDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
      <BlogDetailBreadcrumb post={post}/>

      {/* Hero Section */}
      <BlogDetailHero post={post}/>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Content */}
          <BlogDetailContent post={post}/>

          {/* Sidebar */}
          <BlogDetailSidebar post={post}/>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail; 