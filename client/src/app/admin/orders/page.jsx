"use client"
import { useEffect, useState } from 'react';

const STATUS_OPTIONS = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = '/login?returnUrl=/admin/orders';
            return;
        }
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/orders', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
            if (!res.ok) throw new Error('Không thể tải đơn hàng');
            const data = await res.json();
            setOrders(data.data || []);
        } catch (err) {
            console.error(err);
            setError('Lỗi khi tải danh sách đơn hàng');
        } finally {
            setLoading(false);
        }
    };

    const handleChangeStatus = async (orderId, newStatus) => {
        try {
            const res = await fetch(`/api/orders/${orderId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
                body: JSON.stringify({ status: newStatus }),
            });
            const data = await res.json();
            if (!res.ok) {
                alert(data.message || 'Cập nhật thất bại');
                return;
            }
            // update local state
            setOrders((prev) => prev.map(o => o.id === data.data.id ? data.data : o));
        } catch (err) {
            console.error(err);
            alert('Lỗi khi gửi yêu cầu cập nhật');
        }
    };

    if (loading) return <div className="p-8">Đang tải danh sách đơn hàng...</div>;
    if (error) return <div className="p-8 text-red-600">{error}</div>;

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-6">Quản lý đơn hàng</h1>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="px-4 py-2 border">Mã</th>
                            <th className="px-4 py-2 border">Sản phẩm</th>
                            <th className="px-4 py-2 border">Khách</th>
                            <th className="px-4 py-2 border">SĐT</th>
                            <th className="px-4 py-2 border">Địa chỉ</th>
                            <th className="px-4 py-2 border">Số lượng</th>
                            <th className="px-4 py-2 border">Tổng tiền</th>
                            <th className="px-4 py-2 border">Trạng thái</th>
                            <th className="px-4 py-2 border">Ngày tạo</th>
                            <th className="px-4 py-2 border">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order.id} className="hover:bg-gray-50">
                                <td className="px-4 py-2 border">{order.id}</td>
                                <td className="px-4 py-2 border">{order.product ? order.product.name : order.productId}</td>
                                <td className="px-4 py-2 border">{order.customerName}</td>
                                <td className="px-4 py-2 border">{order.phone}</td>
                                <td className="px-4 py-2 border max-w-xs truncate">{order.address}</td>
                                <td className="px-4 py-2 border">{order.quantity}</td>
                                <td className="px-4 py-2 border">{order.totalPrice ?? '-'}</td>
                                <td className="px-4 py-2 border">
                                    <select
                                        value={order.status}
                                        onChange={(e) => handleChangeStatus(order.id, e.target.value)}
                                        className="border rounded px-2 py-1"
                                    >
                                        {STATUS_OPTIONS.map((s) => (
                                            <option key={s} value={s}>{s}</option>
                                        ))}
                                    </select>
                                </td>
                                <td className="px-4 py-2 border">{new Date(order.createdAt).toLocaleString()}</td>
                                <td className="px-4 py-2 border">
                                    <button onClick={() => navigator.clipboard?.writeText(JSON.stringify(order))} className="text-sm px-2 py-1 border rounded">Sao chép</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
