"use client"
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

const ProductPage = ({ id }) => {
    const router = useRouter();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        if (!id) return;
        fetchProduct();
    }, [id]);

    const fetchProduct = async () => {
        try {
            const res = await fetch(`/api/products/${id}`);
            if (res.ok) {
                const data = await res.json();
                setProduct(data.data);
            } else {
                setError('Không thể tải sản phẩm');
            }
        } catch (err) {
            setError('Đã xảy ra lỗi');
        } finally {
            setLoading(false);
        }
    };



    if (loading) return <div className="flex items-center justify-center min-h-screen bg-gray-100">Đang tải...</div>;
    if (error || !product) return <div className="text-red-500 text-center min-h-screen bg-gray-100">{error}</div>;
    const handleAddToCart = () => {
        // Lấy giỏ hàng hiện tại từ localStorage
        const savedCart = localStorage.getItem('cart');
        const cart = savedCart ? JSON.parse(savedCart) : [];

        // Kiểm tra sản phẩm đã tồn tại trong giỏ chưa
        const existingItem = cart.find(item => item.id === product.id);
        if (existingItem) {
            // Cập nhật số lượng
            const updatedItems = cart.map(item =>
                item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
            );
            localStorage.setItem('cart', JSON.stringify(updatedItems));
        } else {
            // Thêm sản phẩm mới
            const newItem = { ...product, quantity };
            const updatedItems = [...cart, newItem];
            localStorage.setItem('cart', JSON.stringify(updatedItems));
        }

        alert(`Đã thêm ${quantity} ${product.name} vào giỏ hàng!`);
    };
    return (
        <div className="min-h-screen bg-gray-100 py-8 px-40 ">
            <div className="container mx-auto px-4 sm:px-6 md:px-8">
                <button onClick={() => router.back()} className="mb-6 text-green-600 hover:underline flex items-center">
                    ← Quay lại
                </button>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Product Image */}
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                        <img
                            src={product.imageUrl || '/images/sample-product.jpg'}
                            alt={product.name}
                            className="w-full h-96 object-cover"
                        />
                    </div>

                    {/* Product Info */}
                    <div className="bg-white rounded-xl shadow-lg p-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
                        <div className="flex items-center space-x-4 mb-6">
                            <span className="text-2xl font-bold text-green-600">Giá hiện tại: {product.basePrice} ₫</span>
                            <span className="text-xl text-gray-500 line-through">Giá gốc: {product.discountPrice} ₫</span>
                        </div>
                        <p className="text-gray-700 mb-6 leading-relaxed">
                            Sản phẩm nông sản sạch, nguồn gốc rõ ràng từ các nông hộ uy tín. Đã bán {product.sold} sản phẩm.
                        </p>
                        <div className="flex items-center space-x-4 mb-6">
                            <label className="text-gray-700 font-medium">Số lượng:</label>
                            <input
                                type="number"
                                min="1"
                                value={quantity}
                                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value)))}
                                className="w-20 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600"
                            />
                        </div>
                        <button
                            onClick={handleAddToCart}
                            className="w-full bg-green-600 text-white py-4 rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-md"
                        >
                            Thêm vào giỏ hàng
                        </button>
                    </div>
                </div>

                {/* Description Section */}
                <div className="mt-12 bg-white rounded-xl shadow-lg p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Mô tả sản phẩm</h2>
                    <p className="text-gray-700 leading-relaxed">
                        Nông sản sạch {product.name} được thu hoạch từ các vùng miền theo tiêu chuẩn VietGAP, đảm bảo không sử dụng hóa chất độc hại.
                        Sản phẩm tươi ngon, giàu dinh dưỡng, phù hợp cho chế độ ăn lành mạnh.
                        Chúng tôi cam kết chất lượng và nguồn gốc rõ ràng, giúp bạn yên tâm sử dụng hàng ngày.
                    </p>
                </div>

                {/* Related Products */}
                <div className="mt-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Sản phẩm liên quan</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {/* Mock related products - có thể fetch từ API */}
                        {[
                            { name: 'Nông sản tương tự 1', price: 50000, image: '/images/product1.jpg' },
                            { name: 'Nông sản tương tự 2', price: 75000, image: '/images/product2.jpg' },
                            { name: 'Nông sản tương tự 3', price: 120000, image: '/images/product3.jpg' },
                            { name: 'Nông sản tương tự 4', price: 89000, image: '/images/product4.jpg' },
                        ].map((related, index) => (
                            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                                <img src={related.image} alt={related.name} className="w-full h-48 object-cover" />
                                <div className="p-4">
                                    <h3 className="font-semibold text-gray-900 mb-2">{related.name}</h3>
                                    <p className="text-green-600 font-bold">{related.price} ₫</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductPage