"use client"
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const Header = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [categories, setCategories] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const router = useRouter()
    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery) {
            router.push(`/search?q=${searchQuery}`);
        }
    };
    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await fetch('/api/categories');
            if (res.ok) {
                const data = await res.json();
                setCategories(data.data || []);
            }
        } catch (err) {
            console.error('Error fetching categories:', err);
        }
    };
    return (
        <header className="bg-green-700 text-white p-4 sticky top-0 z-10">
            <div className="container mx-auto px-4 sm:px-6 md:px-8 flex justify-between items-center">
                <h1 className="text-3xl font-bold"> <Link href={"/"}> Thế Giới Nông Sản</Link></h1>

                {/* Categories Dropdown */}
                <div className="relative">
                    <button
                        onClick={() => setShowDropdown(!showDropdown)}
                        className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                    >
                        <span>Danh mục sản phẩm</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                    {showDropdown && (
                        <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-md shadow-lg z-10 border">
                            <ul className="py-2">
                                {categories.map((category) => (
                                    <li key={category.id}>
                                        <Link
                                            href={`/category/${category.id}`}
                                            className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                                            onClick={() => setShowDropdown(false)}
                                        >
                                            {category.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
                <div className="flex items-center space-x-4">
                    <form onSubmit={handleSearch} className="flex">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Tìm kiếm nông sản..."
                            className="p-2 rounded-l-md border border-gray-300 text-black focus:outline-none"
                        />
                        <button type="submit" className="bg-yellow-500 text-white p-2 rounded-r-md">
                            Tìm
                        </button>
                    </form>
                    <nav className="space-x-4">
                        <Link href="/login" className="hover:underline">Đăng nhập</Link>
                        <Link href="/register" className="hover:underline">Đăng ký</Link>
                        <Link href="/cart" className="hover:underline">Giỏ hàng</Link>
                        <Link href="/admin" className="hover:underline">Quản trị</Link>
                    </nav>
                </div>
            </div>
        </header>
    )
}

export default Header