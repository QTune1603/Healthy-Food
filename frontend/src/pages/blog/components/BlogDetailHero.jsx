import { categoryMapping } from '../../../config/blogCategories';

const BlogDetailHero = ({ post }) => {
  return (
    <div className="relative h-[60vh] overflow-hidden">
      <img
        src={post.image || 'https://images.unsplash.com/photo-1490645935967-10de6ba17061'}
        alt={post.title}
        className="w-full h-full object-cover"
        loading="lazy"
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
  );
};

export default BlogDetailHero;
