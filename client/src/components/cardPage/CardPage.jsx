"use client"
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
const CardPage = () => {
    const router = useRouter();
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Lấy giỏ hàng từ localStorage
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            setCartItems(JSON.parse(savedCart));
        }
        setLoading(false);
    }, []);

    const updateQuantity = (id, newQuantity) => {
        if (newQuantity < 1) return;
        const updatedItems = cartItems.map(item =>
            item.id === id ? { ...item, quantity: newQuantity } : item
        );
        setCartItems(updatedItems);
        localStorage.setItem('cart', JSON.stringify(updatedItems));
    };

    const removeItem = (id) => {
        const updatedItems = cartItems.filter(item => item.id !== id);
        setCartItems(updatedItems);
        localStorage.setItem('cart', JSON.stringify(updatedItems));
    };

    const totalPrice = cartItems.reduce((total, item) => total + (item.currentPrice * item.quantity), 0);

    const handleCheckout = () => {
        if (cartItems.length === 0) {
            alert('Giỏ hàng trống!');
            return;
        }
        alert(`Tiến hành thanh toán với tổng tiền: ${totalPrice} ₫`);
        // Có thể redirect đến trang thanh toán
    };

    if (loading) return <div className="flex items-center justify-center min-h-screen bg-gray-50">Đang tải...</div>;

    return (
        <div className="min-h-screen bg-gray-50 py-20 px-40">
            <div className="container mx-auto px-4 sm:px-6 md:px-8">
                <div className="flex justify-between items-center mb-8">
                    <Link href="/" className="text-gray-900 hover:underline font-semibold">
                        ← Quay lại Trang chủ
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900">Giỏ hàng của bạn</h1>
                </div>

                {cartItems.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                        <p className="text-gray-500 text-lg mb-4">Giỏ hàng của bạn đang trống</p>
                        <Link href="/" className="bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors">
                            Tiếp tục mua sắm
                        </Link>
                    </div>
                ) : (
                    <>
                        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-900 text-white">
                                        <th className="p-4 text-left">Sản phẩm</th>
                                        <th className="p-4 text-left">Giá</th>
                                        <th className="p-4 text-left">Số lượng</th>
                                        <th className="p-4 text-left">Tổng</th>
                                        <th className="p-4 text-left">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {cartItems.map((item) => (
                                        <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="p-4">
                                                <div className="flex items-center space-x-4">
                                                    <img src={item.imageUrl || '/images/sample-product.jpg'} alt={item.name} className="w-16 h-16 rounded-lg object-cover" />
                                                    <div>
                                                        <h3 className="font-semibold text-gray-900">{item.name}</h3>
                                                        <p className="text-sm text-gray-500">{item.sold} đã bán</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4 text-gray-900 font-semibold">{item.discountPrice} ₫</td>
                                            <td className="p-4">
                                                <div className="flex items-center space-x-2">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        className="bg-gray-300 px-2 py-1 rounded hover:bg-gray-400 transition-colors"
                                                    >
                                                        -
                                                    </button>
                                                    <span className="w-8 text-center">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        className="bg-gray-300 px-2 py-1 rounded hover:bg-gray-400 transition-colors"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="p-4 text-gray-900 font-semibold">
                                                {(item.currentPrice * item.quantity)} ₫
                                            </td>
                                            <td className="p-4">
                                                <button
                                                    onClick={() => removeItem(item.id)}
                                                    className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 transition-colors"
                                                >
                                                    Xóa
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-lg font-semibold text-gray-900">Tổng cộng:</span>
                                <span className="text-2xl font-bold text-gray-900">{totalPrice} ₫</span>
                            </div>
                            <button
                                onClick={handleCheckout}
                                className="w-full bg-gray-900 text-white py-4 rounded-lg font-semibold hover:bg-gray-800 transition-colors shadow-md"
                            >
                                Tiến hành thanh toán
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default CardPage