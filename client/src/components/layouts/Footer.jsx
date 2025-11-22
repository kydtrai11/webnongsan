import React from 'react'

const Footer = () => {
    return (
        <div>
            <section className="bg-gray-200 py-8">
                <div className="container mx-auto px-4 sm:px-6 md:px-8">
                    <h2 className="text-2xl font-semibold mb-4 text-center">Giới Thiệu Về Thế Giới Nông Sản</h2>
                    <p className="text-gray-700 mb-4">
                        “Thế giới nông sản” là Hệ thống bán lẻ sản phẩm nông sản sạch được nhiều chị em nội trợ tin tưởng. Chúng tôi cam kết:
                    </p>
                    <ul className="list-disc list-inside text-gray-700 mb-4">
                        <li>Các sản phẩm nông sản đều có nguồn gốc rõ ràng.</li>
                        <li>Sản phẩm nông sản đa dạng cho khách hàng lựa chọn.</li>
                        <li>Rau, củ, quả luôn tươi ngon, được nhập mới hàng ngày.</li>
                        <li>Giá cả hợp lý, an toàn với sức khỏe.</li>
                    </ul>
                    <p className="text-gray-700">
                        Nông sản sạch là các sản phẩm được sản xuất, chế biến và bảo quản mà không sử dụng hóa chất độc hại, tuân thủ các tiêu chuẩn an toàn thực phẩm và bảo vệ sức khỏe con người.
                    </p>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-green-700 text-white p-4">
                <div className="container mx-auto px-4 sm:px-6 md:px-8">
                    <h3 className="text-xl font-semibold mb-4">Liên Hệ</h3>
                    <p>Trụ sở chính: Làng Sen, Đồng Thắng, Chợ Đồn, Bắc Kạn</p>
                    <p>Cửa Hàng 1: Tổ 11 A – Phường Sông Cầu – Thành Phố Bắc Kạn</p>
                    <p>Cửa Hàng 2: Đội Cấn – Ba Đình – Hà Nội</p>
                    <p>Cửa Hàng 3: Quận 1, Thành Phố Hồ Chí Minh</p>
                    <p>Email: support@thegioinongsan.com</p>
                    <p>Hotline: 0943 611 611</p>
                </div>
            </footer>
        </div>
    )
}

export default Footer