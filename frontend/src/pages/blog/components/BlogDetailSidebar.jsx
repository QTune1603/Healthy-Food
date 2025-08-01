import { Link } from 'react-router-dom';
import { categoryMapping } from '../../../config/blogCategories';

const BlogDetailSidebar = ({ post, relatedPosts }) => {
  return (
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
        {relatedPosts?.length > 0 && (
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
                        loading="lazy"
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
  );
};

export default BlogDetailSidebar;
