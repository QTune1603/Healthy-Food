// src/pages/blog/components/BlogPostItem.jsx
import React from "react";
import { Link } from "react-router-dom";
import { categoryMapping } from "../../../config/blogCategories";

const BlogPostItem = React.memo(({ post, isLast, lastPostRef }) => (
  <Link
    ref={isLast ? lastPostRef : null}
    to={`/blog/${post._id}`}
    className="group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500"
  >
    <div className="relative h-64 overflow-hidden">
      <img
        src={
          post.image ||
          "https://images.unsplash.com/photo-1490645935967-10de6ba17061"
        }
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
        <span className="text-xs text-gray-500">{post.parentCategory}</span>
      </div>
      <h3 className="text-xl font-light text-[#3C493F] mb-3 group-hover:text-[#3C493F]/70 transition-colors">
        {post.title}
      </h3>
      <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
        {post.excerpt || post.content?.substring(0, 100) + "..."}
      </p>
      <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
        <span>{post.likes?.length || 0} lượt thích</span>
        <span>{new Date(post.createdAt).toLocaleDateString("vi-VN")}</span>
      </div>
    </div>
  </Link>
));

export default React.memo(BlogPostItem);
