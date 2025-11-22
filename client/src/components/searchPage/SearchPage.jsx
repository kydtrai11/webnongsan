"use client"
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const SearchPage = ({ q }) => {
    const router = useRouter();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [noResults, setNoResults] = useState(false);

    useEffect(() => {
        if (!q) {
            router.push('/');
            console.log(q);

            return;
        }
        fetchProducts();
    }, [q, router]);

    const fetchProducts = async () => {
        try {
            const res = await fetch(`/api/products/search?q=${encodeURIComponent(q)}`);
            if (res.ok) {
                const data1 = await res.json();
                const data = data1.data
                setProducts(data);
                setNoResults(data.length === 0);
            } else {
                setNoResults(true);
            }
        } catch (err) {
            setNoResults(true);
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = (product) => {
        // Lấy giỏ hàng hiện tại từ localStorage
        const savedCart = localStorage.getItem('cart');
        const cart = savedCart ? JSON.parse(savedCart) : [];

        // Kiểm tra sản phẩm đã tồn tại trong giỏ chưa
        const existingItem = cart.find(item => item.id === product.id);
        if (existingItem) {
            // Cập nhật số lượng
            const updatedItems = cart.map(item =>
                item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
            );
            localStorage.setItem('cart', JSON.stringify(updatedItems));
        } else {
            // Thêm sản phẩm mới với quantity = 1
            const newItem = { ...product, quantity: 1 };
            const updatedItems = [...cart, newItem];
            localStorage.setItem('cart', JSON.stringify(updatedItems));
        }

        alert(`Đã thêm ${product.name} vào giỏ hàng!`);
    };

    if (loading) return <div className="flex items-center justify-center min-h-screen bg-gray-50">Đang tìm kiếm...</div>;
    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4 sm:px-6 md:px-8">
                <div className="flex justify-between items-center mb-8">
                    <Link href="/" className="text-gray-900 hover:underline font-semibold">
                        ← Quay lại Trang chủ
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900">Kết quả tìm kiếm cho: "{q}"</h1>
                </div>

                {noResults ? (
                    <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                        <p className="text-gray-500 text-lg mb-4">Không tìm thấy sản phẩm nào phù hợp với "{q}"</p>
                        <Link href="/" className="bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors">
                            Tiếp tục mua sắm
                        </Link>
                    </div>
                ) : (
                    <>
                        <p className="text-gray-600 mb-6">Tìm thấy {products.length} kết quả</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {products.map((product) => (
                                <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                                    <Link href={`/products/${product.id}`}>
                                        <img src={product.imageUrl || '/images/sample-product.jpg'} alt={product.name} className="w-full h-48 object-cover cursor-pointer" />
                                    </Link>
                                    <div className="p-4">
                                        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
                                        <p className="text-gray-600 text-sm mb-2">Giá gốc: <span className="line-through">{product.basePrice} ₫</span></p>
                                        <p className="text-green-600 font-bold mb-2">Giá: {product.discountPrice} ₫</p>
                                        <p className="text-gray-500 text-sm mb-4">Đã bán: {product.sold}</p>
                                        <button
                                            onClick={() => handleAddToCart(product)}
                                            className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition-colors font-medium"
                                        >
                                            Thêm vào giỏ
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default SearchPage