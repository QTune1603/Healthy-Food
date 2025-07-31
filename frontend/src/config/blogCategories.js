// src/config/blogCategories.js

// 🔹 Mapping để hiển thị tên đẹp cho các category con
export const categoryMapping = {
  potatoes: 'Khoai Tây',
  vegetables: 'Rau Củ',
  mushrooms: 'Nấm',
  fruits: 'Trái Cây',
  grains: 'Ngũ Cốc',
  proteins: 'Protein',
  dairy: 'Sản Phẩm Sữa',
  nuts: 'Hạt',
  herbs: 'Thảo Mộc',
  beverages: 'Đồ Uống',
  snacks: 'Đồ Ăn Vặt',
  desserts: 'Tráng Miệng',
  vegetarian: 'Món Chay',
  organic: 'Thực Phẩm Hữu Cơ',
  superfood: 'Siêu Thực Phẩm',
  vitamins: 'Vitamin & Khoáng Chất',
  diet: 'Chế Độ Ăn Uống'
};

// 🔹 Icon cho các category cha
export const parentCategoryMapping = {
  'Thực Phẩm Cơ Bản': '🥬',
  'Món Ăn Đặc Biệt': '🍽️',
  'Thông Tin Dinh Dưỡng': '📊'
};

// 🔹 Mô tả cho category cha
export const getParentCategoryDescription = (parentCategory) => {
  const descriptions = {
    'Thực Phẩm Cơ Bản': 'Các loại thực phẩm thiết yếu hàng ngày',
    'Món Ăn Đặc Biệt': 'Những món ăn có tính chất đặc biệt',
    'Thông Tin Dinh Dưỡng': 'Kiến thức về dinh dưỡng và sức khỏe'
  };
  return descriptions[parentCategory] || 'Danh mục đặc biệt';
};

// 🔹 Mô tả cho category con
export const getChildCategoryDescription = (category) => {
  const descriptions = {
    potatoes: 'Khoai tây là nguồn cung cấp chất xơ và các chất dinh dưỡng thiết yếu cho cơ thể',
    vegetables: 'Rau củ giàu vitamin, khoáng chất và chất xơ, giúp tăng cường sức khỏe',
    mushrooms: 'Nấm giúp bảo vệ sức khỏe tim mạch và tăng cường hệ miễn dịch',
    vegetarian: 'Khám phá thế giới ẩm thực chay phong phú và bổ dưỡng',
    organic: 'Thực phẩm hữu cơ được trồng và chế biến theo phương pháp tự nhiên',
    superfood: 'Những thực phẩm có giá trị dinh dưỡng đặc biệt cao',
    vitamins: 'Tìm hiểu về các vitamin và khoáng chất thiết yếu',
    diet: 'Hướng dẫn xây dựng chế độ ăn uống khoa học'
  };
  return descriptions[category] || 'Danh mục thực phẩm tốt cho sức khỏe';
};
