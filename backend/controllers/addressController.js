const Address = require('../models/Address');

// Lấy tất cả địa chỉ của user
const getAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({ user: req.user.id }).sort({ isDefault: -1, createdAt: -1 });
    
    res.json({
      success: true,
      data: addresses
    });
  } catch (error) {
    console.error('Get addresses error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy danh sách địa chỉ'
    });
  }
};

// Tạo địa chỉ mới
const createAddress = async (req, res) => {
  try {
    const { fullName, phone, address, city, district, ward, isDefault } = req.body;

    // Validation
    if (!fullName || !phone || !address || !city || !district || !ward) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng điền đầy đủ thông tin địa chỉ'
      });
    }

    // Nếu không có địa chỉ nào, đặt địa chỉ đầu tiên làm mặc định
    const existingAddresses = await Address.find({ user: req.user.id });
    const shouldBeDefault = isDefault || existingAddresses.length === 0;

    const newAddress = new Address({
      user: req.user.id,
      fullName,
      phone,
      address,
      city,
      district,
      ward,
      isDefault: shouldBeDefault
    });

    await newAddress.save();

    res.status(201).json({
      success: true,
      message: 'Thêm địa chỉ thành công',
      data: newAddress
    });
  } catch (error) {
    console.error('Create address error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi thêm địa chỉ'
    });
  }
};

// Cập nhật địa chỉ
const updateAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, phone, address, city, district, ward, isDefault } = req.body;

    // Tìm địa chỉ và kiểm tra quyền sở hữu
    const existingAddress = await Address.findOne({ _id: id, user: req.user.id });
    if (!existingAddress) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy địa chỉ'
      });
    }

    // Validation
    if (!fullName || !phone || !address || !city || !district || !ward) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng điền đầy đủ thông tin địa chỉ'
      });
    }

    // Cập nhật thông tin
    existingAddress.fullName = fullName;
    existingAddress.phone = phone;
    existingAddress.address = address;
    existingAddress.city = city;
    existingAddress.district = district;
    existingAddress.ward = ward;
    existingAddress.isDefault = isDefault || false;

    await existingAddress.save();

    res.json({
      success: true,
      message: 'Cập nhật địa chỉ thành công',
      data: existingAddress
    });
  } catch (error) {
    console.error('Update address error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi cập nhật địa chỉ'
    });
  }
};

// Xóa địa chỉ
const deleteAddress = async (req, res) => {
  try {
    const { id } = req.params;

    // Tìm địa chỉ và kiểm tra quyền sở hữu
    const address = await Address.findOne({ _id: id, user: req.user.id });
    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy địa chỉ'
      });
    }

    // Kiểm tra xem có phải địa chỉ mặc định không
    if (address.isDefault) {
      const otherAddresses = await Address.find({ 
        user: req.user.id, 
        _id: { $ne: id } 
      });
      
      // Nếu có địa chỉ khác, đặt địa chỉ đầu tiên làm mặc định
      if (otherAddresses.length > 0) {
        otherAddresses[0].isDefault = true;
        await otherAddresses[0].save();
      }
    }

    await Address.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Xóa địa chỉ thành công'
    });
  } catch (error) {
    console.error('Delete address error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi xóa địa chỉ'
    });
  }
};

// Đặt địa chỉ mặc định
const setDefaultAddress = async (req, res) => {
  try {
    const { id } = req.params;

    // Tìm địa chỉ và kiểm tra quyền sở hữu
    const address = await Address.findOne({ _id: id, user: req.user.id });
    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy địa chỉ'
      });
    }

    // Bỏ mặc định tất cả địa chỉ khác
    await Address.updateMany(
      { user: req.user.id, _id: { $ne: id } },
      { isDefault: false }
    );

    // Đặt địa chỉ này làm mặc định
    address.isDefault = true;
    await address.save();

    res.json({
      success: true,
      message: 'Đặt địa chỉ mặc định thành công',
      data: address
    });
  } catch (error) {
    console.error('Set default address error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi đặt địa chỉ mặc định'
    });
  }
};

module.exports = {
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress
}; 