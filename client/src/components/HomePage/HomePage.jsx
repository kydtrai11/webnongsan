"use client"
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '../layouts/Header';
import Footer from '../layouts/Footer';

const HomePage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [products, setProducts] = useState([]);
    const router = useRouter();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch('/api/products');
                if (res.ok) {
                    const data = await res.json();
                    setProducts(data.data || []);
                } else {
                    console.error('Lỗi khi fetch products');
                }
            } catch (err) {
                console.error('Error fetching products:', err);
            }
        };
        fetchProducts();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery) {
            router.push(`/search?q=${searchQuery}`);
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

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <Header />

            {/* Banner */}
            <section className="bg-green-600 text-white py-8">
                <div className="container mx-auto px-4 sm:px-6 md:px-8 text-center">
                    <h2 className="text-4xl font-bold mb-4">NÔNG SẢN SẠCH GIÁ SIÊU SỐC</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                        {products && products.length > 0 && products.slice(0, 4).map((product) => (
                            <div key={product.id} className="bg-white text-black p-4 rounded-lg shadow-md">
                                <Link href={`/product/${product.id}`}>
                                    <img src={product.imageUrl || '/images/sample-product.jpg'} alt={product.name} className="w-full h-48 object-cover rounded-md cursor-pointer" />
                                </Link>
                                <Link href={`/product/${product.id}`}>
                                    <h3 className="text-lg font-medium mt-2 cursor-pointer hover:underline">{product.name}</h3>
                                </Link>
                                <p className="text-gray-600 line-through">Giá gốc: {product.basePrice.toLocaleString()} ₫</p>
                                <p className="text-red-500 font-bold">Giá giảm: {product.discountPrice.toLocaleString()} ₫</p>
                                <p className="text-gray-600">Đã bán: {product.sold}</p>
                                <button onClick={() => handleAddToCart(product)} className="mt-2 w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors">Thêm vào giỏ</button>
                            </div>
                        ))}
                    </div>
                    <Link href="/products" className="text-yellow-300 hover:underline mt-4 inline-block">Xem thêm</Link>
                </div>
            </section>

            {/* Product Categories */}
            <section className="container mx-auto py-8 px-4 sm:px-6 md:px-8">
                <h2 className="text-2xl font-semibold mb-4">CÁC LOẠI NÔNG SẢN SẠCH VÙNG MIỀN</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    {products.slice(0, 8).map((product) => (
                        <div key={product.id} className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                            <Link href={`/product/${product.id}`}>
                                <img src={product.imageUrl || '/images/sample-product.jpg'} alt={product.name} className="w-full h-48 object-cover rounded-md cursor-pointer" />
                            </Link>
                            <Link href={`/product/${product.id}`}>
                                <h3 className="text-lg font-medium mt-2 cursor-pointer hover:underline">{product.name}</h3>
                            </Link>
                            <p className="text-gray-600 line-through">Giá gốc: {product.basePrice.toLocaleString()} ₫</p>
                            <p className="text-red-500 font-bold">Giá giảm: {product.discountPrice.toLocaleString()} ₫</p>
                            <p className="text-gray-600">Đã bán: {product.sold}</p>
                            <button onClick={() => handleAddToCart(product)} className="mt-2 w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors">Thêm vào giỏ</button>
                        </div>
                    ))}
                </div>
                <Link href="/products" className="text-green-600 hover:underline mt-4 inline-block">Xem thêm</Link>
            </section>

            {/* Top Searched Products */}
            <section className="container mx-auto py-8 px-4 sm:px-6 md:px-8">
                <h2 className="text-2xl font-semibold mb-4">TÌM KIẾM NHIỀU</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    {products.slice(0, 4).map((product) => (
                        <div key={product.id} className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                            <Link href={`/product/${product.id}`}>
                                <img src={product.imageUrl || '/images/sample-product.jpg'} alt={product.name} className="w-full h-48 object-cover rounded-md cursor-pointer" />
                            </Link>
                            <Link href={`/product/${product.id}`}>
                                <h3 className="text-lg font-medium mt-2 cursor-pointer hover:underline">{product.name}</h3>
                            </Link>
                            <p className="text-gray-600 line-through">Giá gốc: {product.basePrice.toLocaleString()} ₫</p>
                            <p className="text-red-500 font-bold">Giá giảm: {product.discountPrice.toLocaleString()} ₫</p>
                            <p className="text-gray-600">Đã bán: {product.sold}</p>
                            <button onClick={() => handleAddToCart(product)} className="mt-2 w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors">Thêm vào giỏ</button>
                        </div>
                    ))}
                </div>
                <Link href="/products" className="text-green-600 hover:underline mt-4 inline-block">Xem thêm</Link>
            </section>

            {/* About Section */}
            <Footer />
        </div>
    );
}

export default HomePage