"use client";
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '@/components/layouts/Header';
import Footer from '@/components/layouts/Footer';

export default function OrderPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get('productId');
  const initialQuantity = parseInt(searchParams.get('quantity') || '1');

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(initialQuantity);
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    // Nếu chưa đăng nhập, chuyển hướng tới trang login và giữ returnUrl
    if (!token) {
      router.push(`/login?returnUrl=/order?productId=${productId}&quantity=${initialQuantity}`);
      return;
    }

    // Tải thông tin người dùng từ localStorage
    const userInfo = localStorage.getItem('user');
    if (userInfo) {
      const { customerName, phone, address } = JSON.parse(userInfo);
      setCustomerName(customerName || '');
      setPhone(phone || '');
      setAddress(address || '');
    }

    if (!productId) return;
    fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    try {
      const res = await fetch(`/api/products/${productId}`);
      if (res.ok) {
        const data = await res.json();
        setProduct(data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!customerName || !phone || !address) {
      setMessage('Vui lòng điền đầy đủ thông tin giao hàng');
      return;
    }
    setLoading(true);
    try {
      const body = {
        productId: productId,
        quantity,
        customerName,
        phone,
        address,
        note,
      };
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('Đặt hàng thành công! Mã đơn: ' + data.data.id);
        // Optionally redirect to a success page or cart
        setTimeout(() => {
          router.push('/');
        }, 2000);
      } else {
        setMessage(data.message || 'Lỗi khi đặt hàng');
      }
    } catch (err) {
      console.error(err);
      setMessage('Lỗi hệ thống khi gửi đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-100 py-8 px-40">
        <div className="container mx-auto px-4 sm:px-6 md:px-8">
          <h1 className="text-2xl font-bold mb-4">Đặt hàng</h1>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left: product summary */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden p-6 flex items-start">
              {product ? (
                <div className="flex items-start space-x-4 w-full">
                  <img src={product.imageUrl || '/images/sample-product.jpg'} alt={product.name} className="w-40 h-40 object-cover rounded" />
                  <div className="flex-1">
                    <div className="font-semibold text-lg">{product.name}</div>
                    <div className="text-green-600 mt-2">Giá: {product.basePrice} ₫</div>
                    <div className="text-sm text-gray-600 mt-1">Mô tả: {product.description ?? 'Không có mô tả'}</div>
                    <div className="text-sm text-gray-500 mt-2">Đã bán: {product.sold}</div>
                  </div>
                </div>
              ) : (
                <div>Không tìm thấy sản phẩm</div>
              )}
            </div>

            {/* Right: order form */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              {product ? (
                <div className="mb-6">
                  <div className="flex items-center space-x-4">
                    <img src={product.imageUrl || '/images/sample-product.jpg'} alt={product.name} className="w-24 h-24 object-cover rounded" />
                    <div>
                      <div className="font-semibold">{product.name}</div>
                      <div className="text-green-600">Giá: {product.basePrice} ₫</div>
                      <div>Số lượng: {quantity}</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mb-6">Không tìm thấy sản phẩm</div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Tên người nhận</label>
                  <input
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Địa chỉ giao hàng</label>
                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded p-2"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Ghi chú (không bắt buộc)</label>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded p-2"
                    rows={2}
                  />
                </div>

                <div className="flex items-center space-x-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-green-600 text-white px-6 py-3 rounded font-semibold hover:bg-green-700"
                  >
                    {loading ? 'Đang gửi...' : 'Xác nhận đặt hàng'}
                  </button>
                  <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-4 py-3 border rounded"
                  >
                    Quay lại
                  </button>
                </div>
              </form>

              {message && <div className="mt-4 text-center text-sm text-green-700">{message}</div>}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}