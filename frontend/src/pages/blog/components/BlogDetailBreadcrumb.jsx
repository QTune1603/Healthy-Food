import { Link } from 'react-router-dom';

const BlogDetailBreadcrumb = ({ post }) => {
  return (
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
  );
};

export default BlogDetailBreadcrumb;
