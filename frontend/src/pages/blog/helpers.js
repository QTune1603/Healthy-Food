import { 
  categoryMapping, 
  parentCategoryMapping, 
  getParentCategoryDescription, 
  getChildCategoryDescription 
} from '../../config/blogCategories';

export const generateCategoriesFromPosts = (posts = []) => {
  if (!Array.isArray(posts) || posts.length === 0) return [];

  const groupedByParent = posts.reduce((acc, post) => {
    const parent = post.parentCategory;
    if (!acc[parent]) acc[parent] = [];
    acc[parent].push(post);
    return acc;
  }, {});

  return Object.keys(groupedByParent).map(parentCategory => {
    const postsInParent = groupedByParent[parentCategory];
    
    // Nhóm theo category con
    const childCategories = postsInParent.reduce((acc, post) => {
      const category = post.category;
      if (!acc[category]) acc[category] = [];
      acc[category].push(post);
      return acc;
    }, {});

    return {
      id: parentCategory?.toLowerCase().replace(/\s+/g, '-') || '',
      title: parentCategory,
      description: getParentCategoryDescription(parentCategory),
      icon: parentCategoryMapping[parentCategory] || '📋',
      children: Object.keys(childCategories).map(category => ({
        id: category?.toLowerCase() || '',
        title: categoryMapping[category] || category,
        image: childCategories[category][0]?.image || 'https://images.unsplash.com/photo-1490645935967-10de6ba17061',
        description: getChildCategoryDescription(category),
        count: `${childCategories[category].length} bài viết`,
        posts: childCategories[category]
      }))
    };
  });
};

/**
 * Lấy toàn bộ sub-categories
 */
export const getAllItems = (categories = []) => {
  if (!Array.isArray(categories) || categories.length === 0) return [];
  return categories.flatMap(category => category.children || []);
};

/**
 * Lọc posts theo category đã chọn
 */
export const getFilteredItems = (categories = [], posts = [], selectedCategory = 'all') => {
  if (selectedCategory === 'all') return posts;
  if (!Array.isArray(categories) || categories.length === 0) return posts;

  const parentCat = categories.find(cat => cat.id === selectedCategory);
  if (parentCat) {
    return posts.filter(post => post.parentCategory === parentCat.title);
  }

  const allChildren = getAllItems(categories);
  const childCat = allChildren.find(child => child.id === selectedCategory);
  if (childCat) {
    return posts.filter(post => post.category?.toLowerCase() === childCat.id.toLowerCase());
  }

  return [];
};
