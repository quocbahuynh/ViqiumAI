import Link from 'next/link';
import React from 'react';

export default function Power() {
    return (
        <>
            <section className="relative pt-20  max-md:pb-20">
                <div className="container relative z-10">
                    <div className="grid grid-cols-2 max-md:grid-cols-1 gap-10 1xl:gap-x-24">
                        <div className="relative">
                            <p className="section-tagline">KỸ NĂNG BÁN HÀNG</p>
                            <h2 className="mb-7">Khám phá kỹ năng chốt sale của Viqium AI</h2>
                            <p className="mb-11">
                                Chỉ trong một tin nhắn, AI phân tích nhu cầu khách hàng, tư vấn sản phẩm phù hợp, đề xuất khuyến mãi liên quan và tinh tế gợi ý mua thêm để tối đa giá trị đơn hàng. Tất cả diễn ra như thể có một chuyên gia bán hàng đang trực tiếp trò chuyện.
                            </p>
                            <ul className="mb-14 [&>*:not(:last-child)]:mb-5 max-w-[490px]">
                                <li className="flex items-center gap-x-2 border border-dashed border-gray-100 rounded dark:border-borderColour-dark p-2.5">
                                    <span className="flex items-center justify-center w-10 h-10 rounded-full bg-[#F3F8E8] dark:bg-dark-200">
                                        <i className="fa-solid fa-check text-primary" />
                                    </span>
                                    <span className="font-semibold">Tư vấn sản phẩm phù hợp</span>
                                </li>
                                <li className="flex items-center gap-x-2 border border-dashed border-gray-100 rounded dark:border-borderColour-dark p-2.5">
                                    <span className="flex items-center justify-center w-10 h-10 rounded-full bg-[#F3F8E8] dark:bg-dark-200">
                                        <i className="fa-solid fa-check text-primary" />
                                    </span>
                                    <span className="font-semibold">Đề xuất khuyến mãi liên quan</span>
                                </li>
                                <li className="flex items-center gap-x-2 border border-dashed border-gray-100 rounded dark:border-borderColour-dark p-2.5">
                                    <span className="flex items-center justify-center w-10 h-10 rounded-full bg-[#F3F8E8] dark:bg-dark-200">
                                        <i className="fa-solid fa-check text-primary" />
                                    </span>
                                    <span className="font-semibold">Kích cầu để tăng giá trị đơn hàng</span>
                                </li>
                            </ul>
                            <Link href="/request-a-demo" className="btn">
                                Đặt lịch demo ngay
                            </Link>
                        </div>
                        <div className="relative flex max-md:justify-center justify-end items-center aspect-square">
                            <img
                                src="images/chatbot/chatbot-approach.png"
                                alt="company"
                                className="dark:hidden"
                            />
                            <img
                                src="images/chatbot/chatbot-approach.png"
                                alt="company"
                                className="hidden dark:inline-block"
                            />
                            <div className="absolute w-full left-[400px] top-[450px] -translate-x-1/2 -translate-y-1/2 flex max-md:flex-col -z-10">
                                <div className="w-full h-[500px] rounded-full bg-primary-200/25 blur-[145px]" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="relative pt-150 pb-25 max-md:pb-20">
                <div className="container relative z-10">
                    <div className="grid grid-cols-2 max-md:grid-cols-1 gap-10 1xl:gap-x-24">
                        <div className="relative flex max-md:justify-center justify-end items-center aspect-square">
                            <img
                                src="images/chatbot/chatbot-approach-2.png"
                                alt="company"
                                className="dark:hidden"
                            />
                            <img
                                src="images/chatbot/chatbot-approach-2.png"
                                alt="company"
                                className="hidden dark:inline-block"
                            />
                            <div className="absolute w-full left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex max-md:flex-col -z-10">
                                <div className="w-full h-[442px] rounded-full bg-primary-200/25 blur-[145px]" />
                            </div>
                        </div>
                        <div className="relative">
                            <p className="section-tagline">TẠO DỰNG KỊCH BẢN</p>
                            <h2 className="mb-8">Trình diễn kịch bản chốt sale của Viqium AI</h2>
                            <p className="mb-11">
                                Dẫn dắt khách hàng đến quyết định mua hàng, đồng thời khéo léo gợi ý các ưu đãi, sản phẩm liên quan hoặc combo thông minh nhằm gia tăng giá trị đơn hàng. Tất cả đều được Viqium AI suy luận tạo dựng kịch bản hội thoại tự nhiên và hiệu quả.
                            </p>
                            <ul className="mb-14 [&>*:not(:last-child)]:mb-5 max-w-[490px]">
                                <li className="flex items-center gap-x-2 border border-dashed border-gray-100 rounded dark:border-borderColour-dark p-2.5">
                                    <span className="flex items-center justify-center w-10 h-10 rounded-full bg-[#F3F8E8] dark:bg-dark-200">
                                        <i className="fa-solid fa-check text-primary" />
                                    </span>
                                    <span className="font-semibold">Dẫn dắt hội thoại thông minh</span>
                                </li>
                                <li className="flex items-center gap-x-2 border border-dashed border-gray-100 rounded dark:border-borderColour-dark p-2.5">
                                    <span className="flex items-center justify-center w-10 h-10 rounded-full bg-[#F3F8E8] dark:bg-dark-200">
                                        <i className="fa-solid fa-check text-primary" />
                                    </span>
                                    <span className="font-semibold">Gợi ý ưu đãi, sản phẩm liên quan và combo khuyến mãi</span>
                                </li>
                                <li className="flex items-center gap-x-2 border border-dashed border-gray-100 rounded dark:border-borderColour-dark p-2.5">
                                    <span className="flex items-center justify-center w-10 h-10 rounded-full bg-[#F3F8E8] dark:bg-dark-200">
                                        <i className="fa-solid fa-check text-primary" />
                                    </span>
                                    <span className="font-semibold"> Tăng giá trị đơn hàng</span>
                                </li>
                            </ul>
                            <Link href="/request-a-demo" className="btn">
                                Đặt lịch demo ngay
                            </Link>
                        </div>

                    </div>
                </div>
            </section>
        </>
    );
}
