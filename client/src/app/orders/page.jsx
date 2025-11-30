"use client"
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/layouts/Header';
import Footer from '@/components/layouts/Footer';

export default function MyOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push(`/login?returnUrl=/orders`);
      return;
    }
    fetchMyOrders();
  }, []);

  const fetchMyOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/orders/my', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      if (!res.ok) throw new Error('Không thể tải đơn hàng');
      const data = await res.json();
      setOrders(data.data || []);
    } catch (err) {
      console.error(err);
      setError('Lỗi khi tải đơn hàng của bạn');
    } finally {
      setLoading(false);
    }
  };

  const handleReorder = async (orderId) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/reorder`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const data = await res.json();
      if (!res.ok) return alert(data.message || 'Mua lại thất bại');
      alert('Mua lại thành công. Mã đơn mới: ' + data.data.id);
      fetchMyOrders();
    } catch (err) {
      console.error(err);
      alert('Lỗi khi mua lại');
    }
  };

  const handleRequestReturn = async (orderId) => {
    if (!confirm('Bạn có muốn yêu cầu trả hàng cho đơn này?')) return;
    try {
      const res = await fetch(`/api/orders/${orderId}/return`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const data = await res.json();
      if (!res.ok) return alert(data.message || 'Yêu cầu trả hàng thất bại');
      alert('Yêu cầu trả hàng đã được gửi');
      fetchMyOrders();
    } catch (err) {
      console.error(err);
      alert('Lỗi khi gửi yêu cầu trả hàng');
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-100 py-8 px-40">
        <div className="container mx-auto px-4 sm:px-6 md:px-8">
          <h1 className="text-2xl font-bold mb-6">Đơn hàng của tôi</h1>

          {loading ? (
            <div className="p-4">Đang tải đơn đã mua...</div>
          ) : error ? (
            <div className="p-4 text-red-600">{error}</div>
          ) : orders.length === 0 ? (
            <div>Chưa có đơn hàng nào.</div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="bg-white p-4 rounded shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold">Mã đơn: {order.id}</div>
                      <div className="text-sm text-gray-600">
                        Sản phẩm: {order.product ? order.product.name : order.productId}
                      </div>
                      <div className="text-sm">Số lượng: {order.quantity}</div>
                      <div className="text-sm">Tổng tiền: {order.totalPrice ?? '-'}</div>
                      <div className="text-sm">Trạng thái: {order.status}</div>
                    </div>

                    <div className="space-y-2 text-right">
                      <button
                        onClick={() => router.push(`/product/${order.productId}`)}
                        className="px-3 py-1 border rounded"
                      >
                        Xem sản phẩm
                      </button>

                      <button
                        onClick={() => handleReorder(order.id)}
                        className="px-3 py-1 bg-green-600 text-white rounded"
                      >
                        Mua lại
                      </button>

                      {order.status !== "return_requested" &&
                        order.status !== "delivered" && (
                          <button
                            onClick={() => handleRequestReturn(order.id)}
                            className="px-3 py-1 border rounded"
                          >
                            Yêu cầu trả hàng
                          </button>
                        )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );

}
