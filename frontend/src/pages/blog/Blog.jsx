import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { blogService } from '../../services';
import { generateCategoriesFromPosts, getAllItems } from './helpers';
import React from 'react';
import GenericCategoryNav from "../../components/common/GenericCategoryNav";
import BlogHero from "./components/BlogHero";
import BlogCategoryDescription from "./components/BlogCategoryDescription";
import BlogStats from "./components/BlogStats";
import BlogPostItem from "./components/BlogPostItem";

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
      <BlogHero />

      {/* Categories Navigation (reusable) */}
      <GenericCategoryNav
        mainCategories={categories}
        subCategories={allItems}
        selectedCategory={selectedCategory}
        onSelect={setSelectedCategory}
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {selectedCategory !== 'all' && selectedCatInfo && (
          <BlogCategoryDescription categoryInfo={selectedCatInfo} />
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
               <BlogPostItem
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
          <BlogStats
            totalPosts={allItems.reduce(
              (sum, item) => sum + (item.posts?.length || 0),
              0
            )}
            totalCategories={categories.length}
            totalSubCategories={allItems.length}
          />
        )}
      </div>
    </div>
  );
};

export default Blog;
