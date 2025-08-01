const BlogDetailContent = ({ post }) => {
  return (
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
      {post.tags?.length > 0 && (
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
            {Object.entries(post.nutritionInfo).map(([key, value]) => value > 0 && (
              <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex-1">
                  <div className="font-medium text-[#3C493F] mb-1">{key}</div>
                  <div className="text-sm text-gray-600">{value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogDetailContent;
