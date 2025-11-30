const db = require('../models');
const Order = db.Order;
const Product = db.Product;

const createOrder = async (req, res) => {
    try {
        // Yêu cầu user phải đăng nhập
        if (!req.user || !req.user.id) return res.status(401).json({ success: false, message: 'Vui lòng đăng nhập để đặt hàng' });

        const userId = req.user.id;
        const { productId, quantity, customerName, phone, address, note } = req.body;

        if (!productId || !quantity || !customerName || !phone || !address) {
            return res.status(400).json({ success: false, message: 'Thiếu thông tin đặt hàng' });
        }

        // Lấy giá sản phẩm để tính tổng tiền (nếu có)
        const product = await Product.findByPk(productId);
        let totalPrice = null;
        if (product) {
            const price = parseFloat(product.basePrice || 0);
            totalPrice = (price * parseInt(quantity || 1)).toFixed(2);
        }

        const newOrder = await Order.create({
            userId,
            productId,
            quantity,
            customerName,
            phone,
            address,
            note,
            totalPrice,
            status: 'pending',
        });

        return res.status(201).json({ success: true, data: newOrder });
    } catch (error) {
        console.error('createOrder error:', error);
        return res.status(500).json({ success: false, message: 'Lỗi server khi tạo đơn hàng' });
    }
};

const getOrders = async (req, res) => {
    try {
        const orders = await Order.findAll({ include: [{ model: Product }], raw: false, nest: true });
        return res.json({ success: true, data: orders });
    } catch (error) {
        console.error('getOrders error:', error);
        return res.status(500).json({ success: false, message: 'Lỗi server khi lấy đơn hàng' });
    }
};

const getMyOrders = async (req, res) => {
    try {
        if (!req.user || !req.user.id) return res.status(401).json({ success: false, message: 'Vui lòng đăng nhập' });
        const userId = req.user.id;
        const orders = await Order.findAll({ where: { userId }, include: [{ model: Product }], raw: false, nest: true });
        return res.json({ success: true, data: orders });
    } catch (error) {
        console.error('getMyOrders error:', error);
        return res.status(500).json({ success: false, message: 'Lỗi server khi lấy đơn hàng của bạn' });
    }
};

const requestReturn = async (req, res) => {
    try {
        const id = req.params.id;

        if (!req.user || !req.user.id) {
            return res.status(401).json({
                success: false,
                message: 'Vui lòng đăng nhập'
            });
        }

        const userId = req.user.id;

        // Lấy order để kiểm tra quyền (không dùng để update)
        const order = await Order.findByPk(id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy đơn hàng'
            });
        }

        if (order.userId !== userId) {
            return res.status(403).json({
                success: false,
                message: 'Không có quyền thực hiện'
            });
        }

        // Cập nhật bằng Sequelize.update
        const [updated] = await Order.update(
            { status: 'return_requested' },
            { where: { id } }
        );

        if (updated === 0) {
            return res.status(400).json({
                success: false,
                message: 'Không thể cập nhật trạng thái đơn hàng'
            });
        }
        // Lấy lại đơn hàng mới nhất
        const updatedOrder = await Order.findByPk(id);
        return res.json({
            success: true,
            data: updatedOrder
        });

    } catch (error) {
        console.error('requestReturn error:', error);
        return res.status(500).json({
            success: false,
            message: 'Lỗi server khi yêu cầu trả hàng'
        });
    }

};

const reorder = async (req, res) => {
    try {
        const id = req.params.id;
        if (!req.user || !req.user.id) return res.status(401).json({ success: false, message: 'Vui lòng đăng nhập' });
        const userId = req.user.id;
        const order = await Order.findByPk(id);
        if (!order) return res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng' });
        if (order.userId !== userId) return res.status(403).json({ success: false, message: 'Không có quyền thực hiện' });

        const newOrder = await Order.create({
            userId,
            productId: order.productId,
            quantity: order.quantity,
            customerName: order.customerName,
            phone: order.phone,
            address: order.address,
            note: 'Mua lại từ đơn ' + order.id,
            totalPrice: order.totalPrice,
            status: 'pending',
        });

        return res.status(201).json({ success: true, data: newOrder });
    } catch (error) {
        console.error('reorder error:', error);
        return res.status(500).json({ success: false, message: 'Lỗi server khi mua lại' });
    }
};

const updateOrder = async (req, res) => {
    try {
        const id = req.params.id;
        const { status } = req.body;

        // update trả về [số bản ghi cập nhật]
        const [updated] = await Order.update(
            { status },             // dữ liệu cần cập nhật
            { where: { id } }       // điều kiện
        );

        if (updated === 0) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy đơn hàng'
            });
        }
        // Lấy lại bản ghi sau khi cập nhật (optional)
        const updatedOrder = await Order.findByPk(id);
        return res.json({
            success: true,
            data: updatedOrder
        });

    } catch (error) {
        console.error('updateOrder error:', error);
        return res.status(500).json({
            success: false,
            message: 'Lỗi server khi cập nhật đơn hàng'
        });
    }
};

module.exports = { createOrder, getOrders, getMyOrders, updateOrder, requestReturn, reorder };
