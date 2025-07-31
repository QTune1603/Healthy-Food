import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { blogService } from '../../services';
import { categoryMapping } from '../../config/blogCategories';
import { generateCategoriesFromPosts, getAllItems } from './helpers';
import React from 'react';

// 🔹 Component PostItem (memoized để giảm re-render)
const PostItem = React.memo(({ post, isLast, lastPostRef }) => (
  <Link
    ref={isLast ? lastPostRef : null}
    to={`/blog/${post._id}`}
    className="group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500"
  >
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
        <span className="text-xs text-gray-500">{post.parentCategory}</span>
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
));

const Blog = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const observerRef = useRef();
  const cacheRef = useRef({});

  useEffect(() => {
    const fetchAllCategories = async () => {
      try {
        const res = await blogService.getAllPosts({ page: 1, limit: 1000 });
        if (res.success) {
          const categoriesData = generateCategoriesFromPosts(res.data.posts || []);
          setCategories(categoriesData);
        }
      } catch (err) {
        console.error('Error fetching all categories:', err);
      }
    };
    fetchAllCategories();
  }, []);

  useEffect(() => {
    setPosts([]);
    setPage(1);
    fetchPosts(1, selectedCategory, true);
  }, [selectedCategory]);

  useEffect(() => {
    if (selectedCategory === 'all' && page > 1) {
      fetchPosts(page, selectedCategory);
    }
  }, [page]);

  const fetchPosts = async (currentPage, category, isInitial = false) => {
    try {
      if (isInitial) setInitialLoading(true);
      else setLoadingMore(true);

      const cacheKey = `${category}-${currentPage}`;
      if (cacheRef.current[cacheKey]) {
        setPosts((prev) =>
          currentPage === 1
            ? cacheRef.current[cacheKey]
            : [...prev, ...cacheRef.current[cacheKey]]
        );
        if (isInitial) setInitialLoading(false);
        else setLoadingMore(false);
        return;
      }

      const limit = category === 'all' ? 9 : 12;

      let response;
      if (category === 'all') {
        response = await blogService.getAllPosts({ page: currentPage, limit });
      } else {
        const parentCat = categories.find(cat => cat.id === category);
        const childCat = categories.flatMap(cat => cat.children).find(c => c.id === category);

        if (parentCat) {
          response = await blogService.getAllPosts({ parentCategory: parentCat.title, page: currentPage, limit });
        } else if (childCat) {
          response = await blogService.getAllPosts({ category: childCat.id.toLowerCase(), page: currentPage, limit });
        }
      }

      if (response.success) {
        const newPosts = response.data.posts || [];
        cacheRef.current[cacheKey] = newPosts;
        setPosts((prev) =>
          currentPage === 1 ? newPosts : [...prev, ...newPosts]
        );
        setHasMore(category === 'all' ? response.data.totalPages > currentPage : false);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      if (isInitial) setInitialLoading(false);
      else setLoadingMore(false);
    }
  };

  // 🔹 Infinite scroll observer + Prefetch next page
  const lastPostRef = useCallback((node) => {
    if (loadingMore) return;
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        setPage((prev) => {
          const nextPage = prev + 1;
          setTimeout(() => fetchPosts(nextPage + 1, selectedCategory), 0); // Prefetch page kế tiếp
          return nextPage;
        });
      }
    });
    if (node) observerRef.current.observe(node);
  }, [loadingMore, hasMore, selectedCategory]);

  const allItems = useMemo(() => getAllItems(categories), [categories]);
  const selectedCatInfo = useMemo(() => {
    return categories.find(cat => cat.id === selectedCategory) || 
           allItems.find(item => item.id === selectedCategory);
  }, [categories, allItems, selectedCategory]);

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
            {allItems.map((item) => (
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
        {selectedCategory !== 'all' && selectedCatInfo && (
          <div className="mb-12 text-center">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-3xl font-light text-[#3C493F] mb-4">
                {selectedCatInfo.title}
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {selectedCatInfo.description}
              </p>
            </div>
          </div>
        )}

        {initialLoading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3C493F]"></div>
          </div>
        )}

        {error && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">⚠️</div>
            <h3 className="text-xl font-light text-[#3C493F] mb-2">Có lỗi xảy ra</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={() => !initialLoading && fetchPosts(1, selectedCategory, true)}
              disabled={initialLoading}
              className="px-6 py-2 bg-[#3C493F] text-white rounded-lg hover:bg-[#3C493F]/80 transition-colors"
            >
              {initialLoading ? 'Đang tải lại...' : 'Thử lại'}
            </button>
          </div>
        )}

        {!initialLoading && !error && posts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, index) => (
              <PostItem
                key={post._id}
                post={post}
                isLast={index === posts.length - 1}
                lastPostRef={lastPostRef}
              />
            ))}

            {loadingMore && (
              <div className="flex justify-center py-10 col-span-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3C493F]"></div>
              </div>
            )}
          </div>
        )}

        {!initialLoading && !error && posts.length === 0 && (
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

        {!initialLoading && categories.length > 0 && (
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-light text-[#3C493F] mb-2">
                {allItems.reduce((sum, item) => sum + (item.posts?.length || 0), 0)}
              </div>
              <div className="text-sm text-gray-500">Bài Viết</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-light text-[#3C493F] mb-2">{categories.length}</div>
              <div className="text-sm text-gray-500">Danh Mục Chính</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-light text-[#3C493F] mb-2">
                {allItems.length}
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
