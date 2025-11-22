"use client"
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function AdminProducts() {
    const router = useRouter();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({ name: '', originalPrice: '', currentPrice: '', sold: 0, image: '' });

    // Kiểm tra token và role
    useEffect(() => {
        // const token = localStorage.getItem('token');
        // if (!token) {
        //   router.push('/login');
        //   return;
        // }
        // const payload = JSON.parse(atob(token.split('.')[1]));
        // if (payload.role !== 'admin') {
        //   router.push('/');
        //   return;
        // }
        fetchProducts();
    }, [router]);

    const fetchProducts = async () => {
        try {
            const res = await fetch('/api/products');
            if (res.ok) {
                const data = await res.json();
                setProducts(data.data);
                console.log(data.data);

            } else {
                setError('Không thể lấy danh sách sản phẩm');
            }
        } catch (err) {
            setError('Đã xảy ra lỗi');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let url = '/api/products';
            let method = 'POST';
            if (editingProduct) {
                url += `/${editingProduct.id}`;
                method = 'PUT';
            }
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            if (res.ok) {
                setShowForm(false);
                setEditingProduct(null);
                setFormData({ name: '', originalPrice: '', currentPrice: '', sold: 0, image: '' });
                fetchProducts();
            } else {
                setError('Không thể lưu thay đổi');
            }
        } catch (err) {
            setError('Đã xảy ra lỗi');
        }
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setFormData({ name: product.name, originalPrice: product.originalPrice, currentPrice: product.currentPrice, sold: product.sold, image: product.image });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
            try {
                const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
                if (res.ok) {
                    fetchProducts();
                } else {
                    setError('Không thể xóa sản phẩm');
                }
            } catch (err) {
                setError('Đã xảy ra lỗi');
            }
        }
    };

    if (loading) return <div className="flex items-center justify-center min-h-screen">Đang tải...</div>;
    if (error) return <div className="text-red-500 text-center min-h-screen">{error}</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            <div className="container mx-auto px-4 sm:px-6 md:px-8">
                <header className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Quản lý Sản phẩm</h1>
                    <button onClick={() => setShowForm(true)} className="bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 shadow-md transition-colors">
                        Thêm Sản phẩm
                    </button>
                </header>
                <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-900 text-white">
                                <th className="p-4 text-left">ID</th>
                                <th className="p-4 text-left">Tên</th>
                                <th className="p-4 text-left">Giá gốc</th>
                                <th className="p-4 text-left">Giá hiện tại</th>
                                <th className="p-4 text-left">Đã bán</th>
                                <th className="p-4 text-left">Hình ảnh</th>
                                <th className="p-4 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {products.map((product) => (
                                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4 font-medium text-gray-900">{product.id}</td>
                                    <td className="p-4 text-gray-700">{product.name}</td>
                                    <td className="p-4 text-gray-700">{product.basePrice} ₫</td>
                                    <td className="p-4 text-gray-700 font-semibold text-gray-900">{product.currentPrice} ₫</td>
                                    <td className="p-4 text-gray-700">{product.sold}</td>
                                    <td className="p-4 text-gray-700">
                                        <span className="text-sm bg-gray-100 px-2 py-1 rounded">{product.imageUrl}</span>
                                    </td>
                                    <td className="p-4">
                                        <button onClick={() => handleEdit(product)} className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600 mr-2 transition-colors">
                                            Sửa
                                        </button>
                                        <button onClick={() => handleDelete(product.id)} className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 transition-colors">
                                            Xóa
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {showForm && (
                    <div className="mt-8 bg-white p-8 rounded-xl shadow-sm border border-gray-200">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">{editingProduct ? 'Sửa Sản phẩm' : 'Thêm Sản phẩm'}</h2>
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">Tên sản phẩm</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">Giá gốc</label>
                                <input
                                    type="number"
                                    value={formData.originalPrice}
                                    onChange={(e) => setFormData({ ...formData, originalPrice: parseFloat(e.target.value) })}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">Giá hiện tại</label>
                                <input
                                    type="number"
                                    value={formData.currentPrice}
                                    onChange={(e) => setFormData({ ...formData, currentPrice: parseFloat(e.target.value) })}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">Số lượng đã bán</label>
                                <input
                                    type="number"
                                    value={formData.sold}
                                    onChange={(e) => setFormData({ ...formData, sold: parseInt(e.target.value) })}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                                    required
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-gray-700 font-medium mb-2">URL Hình ảnh</label>
                                <input
                                    type="text"
                                    value={formData.image}
                                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                                />
                            </div>
                            <div className="md:col-span-2 flex space-x-4">
                                <button type="submit" className="flex-1 bg-gray-900 text-white py-3 rounded-lg hover:bg-gray-800 font-medium transition-colors">
                                    Lưu
                                </button>
                                <button type="button" onClick={() => { setShowForm(false); setEditingProduct(null); setFormData({ name: '', originalPrice: '', currentPrice: '', sold: 0, image: '' }); }} className="flex-1 bg-gray-300 text-gray-900 py-3 rounded-lg hover:bg-gray-400 font-medium transition-colors">
                                    Hủy
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}