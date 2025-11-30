"use client";
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Footer from '@/components/layouts/Footer';
import Header from '@/components/layouts/Header';

export default function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState('customer');
    const [customerName, setCustomerName] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const router = useRouter();

    const handleRegister = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Mật khẩu không khớp');
            return;
        }
        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, role, customerName, phone, address }),
            });
            const data = await res.json();
            console.log(data);

            if (res.ok) {
                setSuccess('Đăng ký thành công! Đang chuyển hướng...');
                setTimeout(() => router.push('/login'), 2000);
            } else {
                setError(data.message || 'Đăng ký thất bại');
            }
        } catch (err) {
            console.log({ email, password, role, customerName, phone, address });

            setError('Đã xảy ra lỗi, vui lòng thử lại');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            {/* Header */}
            <Header />

            {/* Register Form */}
            <section className="flex-grow flex items-center justify-center py-16">
                <div className="container mx-auto px-4 sm:px-6 md:px-8">
                    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md mx-auto">
                        <h2 className="text-2xl font-bold mb-6 text-center text-green-700">Đăng ký</h2>
                        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
                        {success && <p className="text-green-500 mb-4 text-center">{success}</p>}
                        <form onSubmit={handleRegister}>
                            <div className="mb-4">
                                <label htmlFor="customerName" className="block text-gray-700 font-medium">Tên người nhận</label>
                                <input
                                    type="text"
                                    id="customerName"
                                    value={customerName}
                                    onChange={(e) => setCustomerName(e.target.value)}
                                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="phone" className="block text-gray-700 font-medium">Số điện thoại</label>
                                <input
                                    type="tel"
                                    id="phone"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="address" className="block text-gray-700 font-medium">Địa chỉ</label>
                                <textarea
                                    id="address"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                                    required
                                    rows={3}
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="email" className="block text-gray-700 font-medium">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="password" className="block text-gray-700 font-medium">Mật khẩu</label>
                                <input
                                    type="password"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="confirmPassword" className="block text-gray-700 font-medium">Xác nhận mật khẩu</label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                                    required
                                />
                            </div>
                            <div className="mb-6">
                                <label htmlFor="role" className="block text-gray-700 font-medium">Vai trò</label>
                                <select
                                    id="role"
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                                >
                                    <option value="customer">Khách hàng</option>
                                    <option value="supplier">Nhà cung cấp</option>
                                    <option value="admin">Quản trị viên</option>
                                </select>
                            </div>
                            <button type="submit" className="w-full bg-green-600 text-white p-2 rounded-md hover:bg-green-700">
                                Đăng ký
                            </button>
                        </form>
                        <p className="mt-4 text-center">
                            Đã có tài khoản? <Link href="/login" className="text-green-600 hover:underline">Đăng nhập</Link>
                        </p>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <Footer />
        </div>
    );
}