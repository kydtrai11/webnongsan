"use client"
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
const page = () => {
    // const router = useRouter();
    // const [isAuthenticated, setIsAuthenticated] = useState(false);

    // // Kiểm tra token và role
    // if (typeof window !== 'undefined') {
    //     const token = localStorage.getItem('token');
    //     if (!token) {
    //         router.push('/login');
    //         return null;
    //     }
    //     const payload = JSON.parse(atob(token.split('.')[1]));
    //     if (payload.role !== 'admin') {
    //         router.push('/');
    //         return null;
    //     }
    //     setIsAuthenticated(true);
    // }

    // const handleLogout = () => {
    //     localStorage.removeItem('token');
    //     router.push('/login');
    // };

    // if (!isAuthenticated) return <div>Đang tải...</div>;

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside className="bg-gray-900 text-white w-64 min-h-screen p-6 shadow-lg">
                <h2 className="text-2xl font-bold mb-8 border-b border-gray-700 pb-4">Admin Dashboard</h2>
                <nav className="space-y-4">
                    <Link href="/admin/users" className="flex items-center py-3 px-4 rounded-lg hover:bg-gray-800 transition-colors">
                        <span className="mr-3">👥</span> Quản lý Người dùng
                    </Link>
                    <Link href="/admin/products" className="flex items-center py-3 px-4 rounded-lg hover:bg-gray-800 transition-colors">
                        <span className="mr-3">📦</span> Quản lý Sản phẩm
                    </Link>
                    <Link href="/admin/orders" className="flex items-center py-3 px-4 rounded-lg hover:bg-gray-800 transition-colors">
                        <span className="mr-3">🗂️</span> Quản lý đơn hàng

                    </Link>
                </nav>
                {/* <button onClick={handleLogout} className="mt-12 w-full bg-red-600 hover:bg-red-700 py-3 rounded-lg font-medium transition-colors">
                    Đăng xuất
                </button> */}
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8">
                <div className="max-w-7xl mx-auto">
                    <header className="flex justify-between items-center mb-8">
                        <h1 className="text-4xl font-bold text-gray-900">Chào mừng đến với Admin Dashboard</h1>
                        <div className="text-gray-600">Hệ thống quản lý Nông Sản Sạch</div>
                    </header>
                    <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-200">
                        <p className="text-gray-700 text-lg leading-relaxed">
                            Chọn mục từ sidebar bên trái để quản lý người dùng và sản phẩm. Dashboard được thiết kế đơn giản, dễ sử dụng với giao diện tối giản đen trắng.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default page