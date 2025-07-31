const mongoose = require('mongoose');
const BlogPost = require('../models/BlogPost');
const User = require('../models/User');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

// Connect to database
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected...');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

const blogPosts = [
  // Thực Phẩm Cơ Bản - Khoai Tây
  {
    title: 'Khoai Tây - Nguồn Năng Lượng Tuyệt Vời',
    content: `Khoai tây là một trong những loại thực phẩm phổ biến và bổ dưỡng nhất trên thế giới. Với hàm lượng carbohydrate cao, khoai tây cung cấp năng lượng dồi dào cho cơ thể.

Khoai tây chứa nhiều vitamin C, thậm chí nhiều hơn cả cam và chanh. Một củ khoai tây cỡ vừa có thể cung cấp đến 45% lượng vitamin C cần thiết hàng ngày. Ngoài ra, khoai tây còn giàu kali, giúp điều hòa huyết áp và hỗ trợ chức năng tim mạch.

Chất xơ trong khoai tây giúp cải thiện tiêu hóa và tạo cảm giác no lâu. Điều này rất có lợi cho những người muốn kiểm soát cân nặng. Khoai tây cũng chứa nhiều chất chống oxy hóa, đặc biệt là trong vỏ, giúp bảo vệ cơ thể khỏi các gốc tự do.

Cách chế biến khoai tây ảnh hưởng lớn đến giá trị dinh dưỡng. Luộc hoặc nướng khoai tây sẽ giữ được nhiều chất dinh dưỡng hơn so với chiên. Khi ăn khoai tây, nên giữ lại vỏ để tận dụng tối đa lợi ích sức khỏe.`,
    excerpt: 'Khoai tây là nguồn cung cấp vitamin C, kali và chất xơ tuyệt vời, giúp tăng cường sức khỏe tim mạch và hỗ trợ tiêu hóa.',
    image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=800',
    category: 'potatoes',
    parentCategory: 'Thực Phẩm Cơ Bản',
    tags: ['khoai tây', 'vitamin C', 'kali', 'chất xơ', 'năng lượng'],
    nutritionInfo: {
      calories: 77,
      protein: 2.0,
      carbs: 17.5,
      fat: 0.1,
      fiber: 2.2,
      sugar: 0.8,
      sodium: 6
    },
    servingSize: '100g',
    isPublished: true,
    isFeatured: true
  },

  // Thực Phẩm Cơ Bản - Rau Củ
  {
    title: 'Cà Rốt - Kho Báu Beta-Carotene',
    content: `Cà rốt nổi tiếng với hàm lượng beta-carotene cao, một tiền chất của vitamin A rất quan trọng cho sức khỏe mắt. Màu cam đặc trưng của cà rốt chính là do beta-carotene tạo nên.

Vitamin A từ cà rốt không chỉ tốt cho mắt mà còn hỗ trợ hệ miễn dịch, giúp cơ thể chống lại các bệnh nhiễm trùng. Cà rốt cũng chứa nhiều chất xơ, giúp cải thiện tiêu hóa và duy trì cảm giác no lâu.

Nghiên cứu cho thấy cà rốt có thể giúp giảm nguy cơ mắc một số loại ung thư, đặc biệt là ung thư phổi và ung thư đại tràng. Các chất chống oxy hóa trong cà rốt giúp bảo vệ tế bào khỏi tổn thương.

Cà rốt có thể ăn sống hoặc nấu chín. Khi nấu chín, beta-carotene trong cà rốt dễ hấp thụ hơn. Thêm một chút dầu khi chế biến sẽ giúp cơ thể hấp thụ vitamin A tốt hơn vì đây là vitamin tan trong chất béo.`,
    excerpt: 'Cà rốt giàu beta-carotene và vitamin A, tốt cho mắt, tăng cường miễn dịch và có tác dụng chống ung thư.',
    image: 'https://images.unsplash.com/photo-1445282768818-728615cc910a?w=800',
    category: 'vegetables',
    parentCategory: 'Thực Phẩm Cơ Bản',
    tags: ['cà rốt', 'beta-carotene', 'vitamin A', 'mắt', 'miễn dịch'],
    nutritionInfo: {
      calories: 41,
      protein: 0.9,
      carbs: 9.6,
      fat: 0.2,
      fiber: 2.8,
      sugar: 4.7,
      sodium: 69
    },
    servingSize: '100g',
    isPublished: true
  },

  // Thực Phẩm Cơ Bản - Nấm
  {
    title: 'Nấm Shiitake - Siêu Thực Phẩm Từ Nhật Bản',
    content: `Nấm shiitake là một trong những loại nấm có giá trị dinh dưỡng cao nhất, được sử dụng trong y học cổ truyền Nhật Bản từ hàng nghìn năm. Nấm shiitake chứa nhiều protein chất lượng cao và các amino acid thiết yếu.

Lentinase, một hợp chất đặc biệt trong nấm shiitake, có tác dụng tăng cường hệ miễn dịch và có thể giúp chống lại các tế bào ung thư. Nấm shiitake cũng chứa eritadenine, giúp giảm cholesterol trong máu.

Beta-glucan trong nấm shiitake có tác dụng điều hòa đường huyết và hỗ trợ sức khỏe tim mạch. Nấm này cũng là nguồn cung cấp vitamin D tự nhiên, đặc biệt quan trọng cho sức khỏe xương.

Nấm shiitake có hương vị đặc trưng, umami đậm đà, rất phù hợp để chế biến nhiều món ăn. Có thể xào, nướng, hoặc nấu súp. Khi mua nấm shiitake khô, cần ngâm nước trước khi sử dụng.`,
    excerpt: 'Nấm shiitake chứa lentinase tăng cường miễn dịch, eritadenine giảm cholesterol và beta-glucan điều hòa đường huyết.',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800',
    category: 'mushrooms',
    parentCategory: 'Thực Phẩm Cơ Bản',
    tags: ['nấm shiitake', 'lentinase', 'miễn dịch', 'cholesterol', 'umami'],
    nutritionInfo: {
      calories: 34,
      protein: 2.2,
      carbs: 6.8,
      fat: 0.5,
      fiber: 2.5,
      sugar: 2.4,
      sodium: 9
    },
    servingSize: '100g',
    isPublished: true
  },

  // Món Ăn Đặc Biệt - Món Chay
  {
    title: 'Salad Quinoa Rau Củ - Món Chay Đầy Dinh Dưỡng',
    content: `Quinoa được mệnh danh là "siêu ngũ cốc" vì chứa đầy đủ 9 amino acid thiết yếu mà cơ thể không thể tự sản xuất. Kết hợp với rau củ tươi, salad quinoa trở thành một món ăn chay hoàn hảo.

Món salad này cung cấp protein thực vật chất lượng cao, phù hợp cho người ăn chay hoặc muốn giảm lượng thịt trong chế độ ăn. Quinoa có chỉ số đường huyết thấp, giúp ổn định lượng đường trong máu.

Rau củ trong salad cung cấp nhiều vitamin, khoáng chất và chất xơ. Màu sắc đa dạng của rau củ cho thấy sự phong phú về chất chống oxy hóa. Dressing từ dầu olive và chanh cung cấp chất béo tốt và vitamin C.

Món này rất dễ chế biến và có thể bảo quản trong tủ lạnh vài ngày. Có thể thêm các loại hạt như hạnh nhân, óc chó để tăng thêm protein và chất béo tốt. Đây là lựa chọn tuyệt vời cho bữa trưa nhẹ nhàng nhưng đầy đủ dinh dưỡng.`,
    excerpt: 'Salad quinoa rau củ cung cấp protein thực vật hoàn chỉnh, chất xơ và chất chống oxy hóa từ rau củ tươi.',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800',
    category: 'vegetarian',
    parentCategory: 'Món Ăn Đặc Biệt',
    tags: ['quinoa', 'salad', 'chay', 'protein thực vật', 'amino acid'],
    nutritionInfo: {
      calories: 185,
      protein: 6.8,
      carbs: 32.0,
      fat: 3.8,
      fiber: 4.2,
      sugar: 3.1,
      sodium: 12
    },
    servingSize: '150g',
    isPublished: true,
    isFeatured: true
  },

  // Món Ăn Đặc Biệt - Thực Phẩm Hữu Cơ
  {
    title: 'Cà Chua Hữu Cơ - Nguồn Lycopene Tự Nhiên',
    content: `Cà chua hữu cơ được trồng không sử dụng thuốc trừ sâu hay phân bón hóa học, giữ nguyên hương vị tự nhiên và giá trị dinh dưỡng cao nhất. Lycopene trong cà chua là chất chống oxy hóa mạnh mẽ.

Lycopene có tác dụng bảo vệ da khỏi tác hại của tia UV, giảm nguy cơ ung thư tuyến tiền liệt và hỗ trợ sức khỏe tim mạch. Khi nấu chín, lycopene trong cà chua trở nên dễ hấp thụ hơn.

Cà chua hữu cơ thường có hàm lượng vitamin C cao hơn so với cà chua thông thường. Vitamin C giúp tăng cường miễn dịch và hỗ trợ sản xuất collagen cho da khỏe mạnh.

Cà chua cũng chứa folate, kali và vitamin K. Folate quan trọng cho phụ nữ mang thai, kali giúp điều hòa huyết áp, và vitamin K hỗ trợ sức khỏe xương. Cà chua hữu cơ có thể ăn sống trong salad hoặc nấu chín trong các món xào, súp.`,
    excerpt: 'Cà chua hữu cơ giàu lycopene chống oxy hóa, vitamin C tăng miễn dịch và không chứa hóa chất độc hại.',
    image: 'https://suckhoedoisong.qltns.mediacdn.vn/324455921873985536/2021/9/25/tac-dung-cua-ca-chua-doi-voi-suc-khoe-1-1632310636-831-width640height427-1632567723926-16325677242441321628137.jpg',
    category: 'organic',
    parentCategory: 'Món Ăn Đặc Biệt',
    tags: ['cà chua', 'hữu cơ', 'lycopene', 'vitamin C', 'chống oxy hóa'],
    nutritionInfo: {
      calories: 18,
      protein: 0.9,
      carbs: 3.9,
      fat: 0.2,
      fiber: 1.2,
      sugar: 2.6,
      sodium: 5
    },
    servingSize: '100g',
    isPublished: true
  },

  // Món Ăn Đặc Biệt - Siêu Thực Phẩm
  {
    title: 'Hạt Chia - Siêu Thực Phẩm Omega-3',
    content: `Hạt chia là một trong những nguồn cung cấp omega-3 thực vật tốt nhất, với hàm lượng cao hơn cả cá hồi. Omega-3 trong hạt chia giúp giảm viêm và hỗ trợ sức khỏe não bộ.

Hạt chia chứa nhiều chất xơ hòa tan, khi ngâm nước sẽ tạo thành gel có tác dụng làm chậm quá trình tiêu hóa, giúp ổn định đường huyết và tạo cảm giác no lâu. Điều này rất có lợi cho việc kiểm soát cân nặng.

Protein trong hạt chia chứa đầy đủ các amino acid thiết yếu, tương tự như quinoa. Hạt chia cũng giàu canxi, magie và phốt pho, quan trọng cho sức khỏe xương và răng.

Hạt chia có thể ngâm với nước, sữa hoặc nước trái cây để tạo thành pudding. Cũng có thể rắc lên salad, sữa chua hoặc xay sinh tố. Hạt chia không có vị đặc biệt nên dễ kết hợp với nhiều món ăn khác nhau.`,
    excerpt: 'Hạt chia cung cấp omega-3 thực vật, chất xơ hòa tan và protein hoàn chỉnh, hỗ trợ sức khỏe não bộ và tim mạch.',
    image: 'https://bizweb.dktcdn.net/thumb/grande/100/432/482/products/0-408dd9ab-a934-4dd1-b389-0a89ce3cf176.jpg?v=1627716909570',
    category: 'superfood',
    parentCategory: 'Món Ăn Đặc Biệt',
    tags: ['hạt chia', 'omega-3', 'chất xơ', 'protein', 'siêu thực phẩm'],
    nutritionInfo: {
      calories: 486,
      protein: 16.5,
      carbs: 42.1,
      fat: 30.7,
      fiber: 34.4,
      sugar: 0,
      sodium: 16
    },
    servingSize: '100g',
    isPublished: true,
    isFeatured: true
  },

  // Thông Tin Dinh Dưỡng - Vitamin & Khoáng Chất
  {
    title: 'Vitamin D - Vitamin Ánh Nắng Mặt Trời',
    content: `Vitamin D được gọi là "vitamin ánh nắng" vì cơ thể có thể tự sản xuất khi da tiếp xúc với ánh nắng mặt trời. Tuy nhiên, nhiều người vẫn thiếu vitamin D do ít tiếp xúc với ánh nắng.

Vitamin D đóng vai trò quan trọng trong việc hấp thụ canxi và phốt pho, giúp xương và răng chắc khỏe. Thiếu vitamin D có thể dẫn đến bệnh còi xương ở trẻ em và loãng xương ở người lớn.

Nghiên cứu gần đây cho thấy vitamin D còn có tác dụng tăng cường hệ miễn dịch, giảm nguy cơ nhiễm trùng đường hô hấp và có thể giúp ngăn ngừa một số bệnh tự miễn.

Nguồn thực phẩm giàu vitamin D bao gồm cá béo (cá hồi, cá thu), lòng đỏ trứng, nấm maitake và các sản phẩm được bổ sung vitamin D. Thời gian tắm nắng tốt nhất là từ 10-15 phút vào buổi sáng sớm hoặc chiều muộn.`,
    excerpt: 'Vitamin D cần thiết cho sức khỏe xương, tăng cường miễn dịch và có thể sản xuất tự nhiên qua ánh nắng mặt trời.',
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800',
    category: 'vitamins',
    parentCategory: 'Thông Tin Dinh Dưỡng',
    tags: ['vitamin D', 'ánh nắng', 'canxi', 'xương', 'miễn dịch'],
    nutritionInfo: {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0,
      sugar: 0,
      sodium: 0
    },
    servingSize: 'N/A',
    isPublished: true
  },

  // Thông Tin Dinh Dưỡng - Chế Độ Ăn Uống
  {
    title: 'Chế Độ Ăn Địa Trung Hải - Bí Quyết Sống Thọ',
    content: `Chế độ ăn Địa Trung Hải được UNESCO công nhận là di sản văn hóa phi vật thể của nhân loại. Đây là chế độ ăn của người dân vùng Địa Trung Hải, nổi tiếng với tuổi thọ cao và tỷ lệ bệnh tim mạch thấp.

Chế độ ăn này tập trung vào rau củ, trái cây, ngũ cốc nguyên hạt, đậu, hạt và dầu olive. Cá và hải sản được ưu tiên hơn thịt đỏ. Rượu vang đỏ được sử dụng vừa phải trong bữa ăn.

Dầu olive nguyên chất là nguồn chất béo chính, cung cấp chất béo không bão hòa đơn tốt cho tim mạch. Cá béo như cá hồi, cá sardine cung cấp omega-3 chống viêm.

Nghiên cứu cho thấy chế độ ăn Địa Trung Hải giúp giảm nguy cơ bệnh tim mạch, đột quỵ, tiểu đường type 2 và một số loại ung thư. Chế độ ăn này cũng có thể giúp duy trì trí nhớ và giảm nguy cơ sa sút trí tuệ.`,
    excerpt: 'Chế độ ăn Địa Trung Hải giàu rau củ, dầu olive và cá, giúp giảm nguy cơ bệnh tim mạch và tăng tuổi thọ.',
    image: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800',
    category: 'diet',
    parentCategory: 'Thông Tin Dinh Dưỡng',
    tags: ['địa trung hải', 'dầu olive', 'omega-3', 'tim mạch', 'tuổi thọ'],
    nutritionInfo: {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0,
      sugar: 0,
      sodium: 0
    },
    servingSize: 'N/A',
    isPublished: true
  }
];

const seedBlog = async () => {
  try {
    await connectDB();

    // Tìm user admin để làm author (nếu không có thì tạo)
    let adminUser = await User.findOne({ email: 'admin@healthyfood.com' });
    
    if (!adminUser) {
      adminUser = await User.create({
        fullName: 'Admin HealthyFood',
        email: 'admin@healthyfood.com',
        password: 'admin123',
        role: 'admin'
      });
      console.log('Created admin user');
    }

    // Xóa tất cả blog posts cũ
    await BlogPost.deleteMany({});
    console.log('Cleared existing blog posts');

    // Thêm author ID vào từng post mẫu
    const postsWithAuthor = blogPosts.map(post => ({
      ...post,
      author: adminUser._id
    }));

    // Clone thêm bài viết random để đủ dữ liệu test infinite scroll
    const extraPosts = [];
      for (let i = 0; i < 40; i++) {
        const randomPost = blogPosts[Math.floor(Math.random() * blogPosts.length)];
        extraPosts.push({
          ...randomPost,
          title: `${randomPost.title} - Bản mở rộng ${i + 1}`,
          excerpt: `${randomPost.excerpt} (Bản mở rộng ${i + 1})`,
          category: randomPost.category,
          parentCategory: randomPost.parentCategory,
          views: Math.floor(Math.random() * 100),
          isFeatured: Math.random() < 0.1, // ít featured hơn bài gốc
          createdAt: new Date(Date.now() - (i + 10) * 86400000), // clone cũ hơn bài gốc
          author: adminUser._id
        });
      }



    // Gộp tất cả posts
    const allPosts = [...postsWithAuthor, ...extraPosts];

    // Insert blog posts
    const createdPosts = await BlogPost.insertMany(allPosts);
    console.log(`Created ${createdPosts.length} blog posts`);

    // Test log categories cho organic và superfood
    const testCategories = async () => {
      const organicPosts = await BlogPost.find({ category: /organic/i });
      console.log("🍅 Organic posts in DB:");
      organicPosts.forEach(p => {
        console.log(`Title: ${p.title}, category: "${p.category}", parent: "${p.parentCategory}"`);
      });

      const superfoodPosts = await BlogPost.find({ category: /superfood/i });
      console.log("🌱 Superfood posts in DB:");
      superfoodPosts.forEach(p => {
        console.log(`Title: ${p.title}, category: "${p.category}", parent: "${p.parentCategory}"`);
      });
    };
    testCategories();



    // In ra danh sách posts đã tạo
    createdPosts.forEach(post => {
      console.log(`- ${post.title} (${post.category})`);
    });

    console.log('Blog seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding blog:', error);
    process.exit(1);
  }
};

// Chạy seeder nếu file được gọi trực tiếp
if (require.main === module) {
  seedBlog();
}

module.exports = seedBlog; 