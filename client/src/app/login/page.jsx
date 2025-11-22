"use client"
import Footer from '@/components/layouts/Footer';
import Header from '@/components/layouts/Header';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();
            if (res.ok) {
                localStorage.setItem('token', data.token);
                router.push('/admin');
            } else {
                setError(data.message || 'Đăng nhập thất bại');
            }
        } catch (err) {
            setError('Đã xảy ra lỗi, vui lòng thử lại');
        }
    };

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: forgotPasswordEmail }),
            });
            const data = await res.json();
            if (res.ok) {
                setSuccess('Liên kết khôi phục đã được gửi đến email của bạn!');
                setTimeout(() => router.push(`/reset-password?token=${data.resetToken}`), 2000);
            } else {
                setError(data.message || 'Không thể gửi yêu cầu khôi phục');
            }
        } catch (err) {
            setError('Đã xảy ra lỗi, vui lòng thử lại');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            {/* Header */}
            <Header />

            {/* Login Form */}
            <section className="flex-grow flex items-center justify-center py-16 ">
                <div className="container mx-auto px-4 sm:px-6 md:px-8">
                    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md mx-auto">
                        <h2 className="text-2xl font-bold mb-6 text-center text-green-700">
                            {showForgotPassword ? 'Khôi phục mật khẩu' : 'Đăng nhập'}
                        </h2>
                        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
                        {success && <p className="text-green-500 mb-4 text-center">{success}</p>}

                        {!showForgotPassword ? (
                            <form onSubmit={handleLogin}>
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
                                <div className="mb-6">
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
                                <button type="submit" className="w-full bg-green-600 text-white p-2 rounded-md hover:bg-green-700">
                                    Đăng nhập
                                </button>
                                <p className="mt-4 text-center">
                                    <button
                                        type="button"
                                        onClick={() => setShowForgotPassword(true)}
                                        className="text-green-600 hover:underline"
                                    >
                                        Quên mật khẩu?
                                    </button>
                                </p>
                                <p className="mt-2 text-center">
                                    Chưa có tài khoản? <Link href="/register" className="text-green-600 hover:underline">Đăng ký</Link>
                                </p>
                            </form>
                        ) : (
                            <form onSubmit={handleForgotPassword}>
                                <div className="mb-4">
                                    <label htmlFor="forgotPasswordEmail" className="block text-gray-700 font-medium">Email</label>
                                    <input
                                        type="email"
                                        id="forgotPasswordEmail"
                                        value={forgotPasswordEmail}
                                        onChange={(e) => setForgotPasswordEmail(e.target.value)}
                                        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                                        required
                                    />
                                </div>
                                <button type="submit" className="w-full bg-green-600 text-white p-2 rounded-md hover:bg-green-700">
                                    Gửi liên kết khôi phục
                                </button>
                                <p className="mt-4 text-center">
                                    <button
                                        type="button"
                                        onClick={() => setShowForgotPassword(false)}
                                        className="text-green-600 hover:underline"
                                    >
                                        Quay lại đăng nhập
                                    </button>
                                </p>
                            </form>
                        )}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <Footer />
        </div>
    );
}