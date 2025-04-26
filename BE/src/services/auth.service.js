const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../models');
const Customer = db.Customer;

const JWT_SECRET = process.env.JWT_SECRET;
const SALT_ROUNDS = 10;

const registerCustomer = async (customerData) => {
    const { name, email, address, username, password } = customerData;

    // --- Validation cơ bản ---
    if (!name || !email || !address || !password) {
        throw new Error('Vui lòng điền đủ thông tin bắt buộc: tên, email, địa chỉ, mật khẩu.');
    }

    // --- Kiểm tra Email hoặc Username đã tồn tại chưa ---
    const existingCustomer = await Customer.findOne({
        where: {
            [db.Sequelize.Op.or]: [{ email: email }, { username: username }]
        }
    });

    if (existingCustomer) {
        if (existingCustomer.email === email) {
            throw new Error('Email đã được sử dụng.');
        }
        if (existingCustomer.username === username) {
            throw new Error('Username đã được sử dụng.');
        }
    }

    // --- Hash mật khẩu ---
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // --- Tạo customer mới ---
    const newCustomer = await Customer.create({
        name,
        email,
        address, // Sửa lỗi chính tả từ adress thành address
        username,
        password: hashedPassword // Lưu mật khẩu đã hash
    });

    // --- Trả về thông tin customer (loại bỏ password) ---
    // eslint-disable-next-line no-unused-vars
    const { password: _, ...customerWithoutPassword } = newCustomer.toJSON();
    return customerWithoutPassword;
};

const loginCustomer = async (loginData) => {
    const { emailOrUsername, password } = loginData;

    if (!emailOrUsername || !password) {
        throw new Error('Vui lòng nhập email/username và mật khẩu.');
    }

    // --- Tìm customer bằng email hoặc username ---
    const customer = await Customer.findOne({
        where: {
            [db.Sequelize.Op.or]: [{ email: emailOrUsername }, { username: emailOrUsername }]
        }
    });

    if (!customer) {
        throw new Error('Email/username hoặc mật khẩu không chính xác.'); // Thông báo chung để bảo mật
    }

    // --- So sánh mật khẩu ---
    const isPasswordMatch = await bcrypt.compare(password, customer.password);

    if (!isPasswordMatch) {
        throw new Error('Email/username hoặc mật khẩu không chính xác.');
    }

    // --- Tạo JWT ---
    // Payload chứa thông tin bạn muốn mã hóa vào token (đừng để thông tin nhạy cảm)
    const payload = {
        id: customer.id,
        email: customer.email,
        username: customer.username,
        role: "customer"
    };

    // Ký token với secret và tùy chọn (ví dụ: thời hạn hết hạn)
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' }); // Token hết hạn sau 1 giờ

    // --- Trả về token và thông tin cơ bản của user ---
    // eslint-disable-next-line no-unused-vars
    const { password: _, ...customerInfo } = customer.toJSON();
    return { token, customer: customerInfo };
};

module.exports = {
    registerCustomer,
    loginCustomer
};