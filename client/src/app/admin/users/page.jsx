"use client"
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function AdminUsers() {
    const router = useRouter();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({ email: '', password: '', role: 'customer' });

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
        fetchUsers();
    }, [router]);

    const fetchUsers = async () => {
        try {
            const res = await fetch('/api/auth/users', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            if (res.ok) {
                const data = await res.json();
                setUsers(data);
            } else {
                setError('Không thể lấy danh sách người dùng');
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
            let url = '/api/auth/users';
            let method = 'POST';
            if (editingUser) {
                url += `/${editingUser.id}`;
                method = 'PUT';
            }
            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(formData),
            });
            if (res.ok) {
                setShowForm(false);
                setEditingUser(null);
                setFormData({ email: '', password: '', role: 'customer' });
                fetchUsers();
            } else {
                setError('Không thể lưu thay đổi');
            }
        } catch (err) {
            setError('Đã xảy ra lỗi');
        }
    };

    const handleEdit = (user) => {
        setEditingUser(user);
        setFormData({ email: user.email, password: '', role: user.role });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (confirm('Bạn có chắc muốn xóa người dùng này?')) {
            try {
                const res = await fetch(`/api/auth/users/${id}`, {
                    method: 'DELETE',
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                });
                if (res.ok) {
                    fetchUsers();
                } else {
                    setError('Không thể xóa người dùng');
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
                    <h1 className="text-3xl font-bold text-gray-900">Quản lý Người dùng</h1>
                    <button onClick={() => setShowForm(true)} className="bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 shadow-md transition-colors">
                        Thêm Người dùng
                    </button>
                </header>
                <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-900 text-white">
                                <th className="p-4 text-left">ID</th>
                                <th className="p-4 text-left">Email</th>
                                <th className="p-4 text-left">Vai trò</th>
                                <th className="p-4 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4 font-medium text-gray-900">{user.id}</td>
                                    <td className="p-4 text-gray-700">{user.email}</td>
                                    <td className="p-4">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${user.role === 'admin' ? 'bg-red-100 text-red-800' :
                                                user.role === 'supplier' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                                            }`}>
                                            {user.role === 'customer' ? 'Khách hàng' : user.role === 'supplier' ? 'Nhà cung cấp' : 'Quản trị viên'}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <button onClick={() => handleEdit(user)} className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600 mr-2 transition-colors">
                                            Sửa
                                        </button>
                                        <button onClick={() => handleDelete(user.id)} className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 transition-colors">
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
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">{editingUser ? 'Sửa Người dùng' : 'Thêm Người dùng'}</h2>
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">Email</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">{editingUser ? 'Mật khẩu mới (để trống nếu không đổi)' : 'Mật khẩu'}</label>
                                <input
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                                    required={!editingUser}
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-gray-700 font-medium mb-2">Vai trò</label>
                                <select
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                                >
                                    <option value="customer">Khách hàng</option>
                                    <option value="supplier">Nhà cung cấp</option>
                                    <option value="admin">Quản trị viên</option>
                                </select>
                            </div>
                            <div className="md:col-span-2 flex space-x-4">
                                <button type="submit" className="flex-1 bg-gray-900 text-white py-3 rounded-lg hover:bg-gray-800 font-medium transition-colors">
                                    Lưu
                                </button>
                                <button type="button" onClick={() => { setShowForm(false); setEditingUser(null); setFormData({ email: '', password: '', role: 'customer' }); }} className="flex-1 bg-gray-300 text-gray-900 py-3 rounded-lg hover:bg-gray-400 font-medium transition-colors">
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