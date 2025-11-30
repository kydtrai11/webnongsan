"use client";
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

const ProductPage = ({ id }) => {
    const router = useRouter();
    const [product, setProduct] = useState(null);
    const [productCate, setProductCate] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(null);

    const DEFAULT_IMAGE = "https://cdn2.tuoitre.vn/thumb_w/1200/2018/6/4/photo1528103879605-15281038796051097956053.jpg";

    useEffect(() => {
        if (!id) return;
        fetchProduct();
    }, [id]);

    const fetchProduct = async () => {
        try {
            const res = await fetch(`/api/products/${id}`);
            if (res.ok) {
                const data = await res.json();
                let productData = data.data;

                // ✔ Ảnh chính
                const mainImg = productData.imageUrl || DEFAULT_IMAGE;

                // ✔ Tách các ảnh phụ từ product.imageUrls
                const subImgs = productData.imageUrls
                    ? productData.imageUrls.split(',').map(url => url.trim())
                    : [DEFAULT_IMAGE, DEFAULT_IMAGE, DEFAULT_IMAGE];

                const finalProduct = {
                    ...productData,
                    imageUrl: mainImg,
                    subImages: subImgs,
                };

                setProduct(finalProduct);
                setSelectedImage(mainImg);
                fetchCategoryProducts(finalProduct.categoryId);
            } else {
                setError('Không thể tải sản phẩm');
            }
        } catch (err) {
            console.log(err);
            setError('Đã xảy ra lỗi');
        } finally {
            setLoading(false);
        }
    };

    const fetchCategoryProducts = async (categoryId) => {
        try {
            const res = await fetch(`/api/categories/categorybyproduct/${categoryId}`);
            if (res.ok) {
                const data = await res.json();
                if (data.success) {
                    setProductCate(data.data.products);
                } else {
                    setError('Không tìm thấy danh mục');
                }
            } else {
                setError('Không thể tải dữ liệu');
            }
        } catch (err) {
            console.log(err);
        }
    };

    if (loading) return <div className="flex items-center justify-center min-h-screen bg-gray-100">Đang tải...</div>;
    if (error || !product) return <div className="text-red-500 text-center min-h-screen bg-gray-100">{error}</div>;

    const handleAddToCart = () => {
        const savedCart = localStorage.getItem('cart');
        const cart = savedCart ? JSON.parse(savedCart) : [];

        const existingItem = cart.find(item => item.id === product.id);
        if (existingItem) {
            const updatedItems = cart.map(item =>
                item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
            );
            localStorage.setItem('cart', JSON.stringify(updatedItems));
        } else {
            const newItem = { ...product, quantity };
            const updatedItems = [...cart, newItem];
            localStorage.setItem('cart', JSON.stringify(updatedItems));
        }

        alert(`Đã thêm ${quantity} ${product.name} vào giỏ hàng!`);
    };

    const handleOrderNow = () => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
        const returnUrl = encodeURIComponent(`/order?productId=${product.id}&quantity=${quantity}`);

        // Kiểm tra xem người dùng đã đăng nhập chưa
        if (!token) {
            router.push(`/login?returnUrl=${returnUrl}`);
            return;
        }

        router.push(`/order?productId=${product.id}&quantity=${quantity}`);
    };

    return (
        <div className="min-h-screen bg-gray-100 py-8 px-40">
            <div className="container mx-auto px-4 sm:px-6 md:px-8">

                <button onClick={() => router.back()} className="mb-6 text-green-600 hover:underline flex items-center">
                    ← Quay lại
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* ⭐ IMAGE SECTION ⭐ */}
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden p-4">
                        <img
                            src={selectedImage || product.imageUrl}
                            alt={product.name}
                            className="w-full h-96 object-cover rounded-lg"
                        />

                        {/* Thumbnail Images */}
                        <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
                            {[product.imageUrl, ...product.subImages].map((img, idx) => (
                                <img
                                    key={idx}
                                    src={img || DEFAULT_IMAGE}
                                    onClick={() => setSelectedImage(img)}
                                    className={`
                                        h-20 w-20 object-cover rounded-lg cursor-pointer border-2
                                        ${selectedImage === img ? 'border-green-600' : 'border-transparent'}
                                        hover:opacity-80 transition
                                    `}
                                    alt="thumbnail"
                                />
                            ))}
                        </div>
                    </div>

                    {/* PRODUCT INFO */}
                    <div className="bg-white rounded-xl shadow-lg p-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>

                        <div className="flex items-center space-x-4 mb-6">
                            <span className="text-2xl font-bold text-green-600">Giá hiện tại: {product.discountPrice} ₫</span>
                            <span className="text-xl text-gray-500 line-through">Giá gốc: {product.basePrice} ₫</span>
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

                        <div className="space-y-3">
                            <button
                                onClick={handleAddToCart}
                                className="w-full bg-green-600 text-white py-4 rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-md"
                            >
                                Thêm vào giỏ hàng
                            </button>

                            <button
                                onClick={handleOrderNow}
                                className="w-full bg-yellow-500 text-white py-4 rounded-lg font-semibold hover:bg-yellow-600 transition-colors shadow-md"
                            >
                                Đặt hàng ngay
                            </button>
                        </div>
                    </div>
                </div>

                {/* DESCRIPTION */}
                <div className="mt-12 bg-white rounded-xl shadow-lg p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Mô tả sản phẩm</h2>
                    <p className="text-gray-700 leading-relaxed">
                        Nông sản sạch {product.name} được thu hoạch theo tiêu chuẩn VietGAP, đảm bảo an toàn và chất lượng.
                    </p>
                </div>

                {/* RELATED PRODUCTS */}
                <div className="mt-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Sản phẩm liên quan</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {productCate?.slice(0, 4).map((related, index) => (
                            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                                <img src={related.imageUrl || DEFAULT_IMAGE} alt={related.name} className="w-full h-48 object-cover" />
                                <div className="p-4">
                                    <h3 className="font-semibold text-gray-900 mb-2">{related.name}</h3>
                                    <p className="text-green-600 font-bold">{related.discountPrice} ₫</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ProductPage;