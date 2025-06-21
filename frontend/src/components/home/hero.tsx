"use client";
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function Hero() {
    return (
        <section className="hero bg-white dark:bg-dark-300 relative max-lg:pt-[160px] max-lg:pb-25 pt-[230px] pb-[140px] max-md:pb-[70px]">
            <div className="container">
                <div className="grid grid-cols-12 items-center relative z-10 max-lg:gap-y-10">
                    <div className="col-span-12 md:col-span-6 lg:col-span-5">
                        <h1 className="mb-7 max-md:mb-8">
                            AI dành cho <br /> Fanpage Bán Hàng
                        </h1>
                        <p className="mb-7 max-md:mb-8">
                            <strong>Tăng doanh thu – Giảm 75% chi phí nhân sự </strong>nhờ <strong>Viqium AI.</strong><br />
                            <strong>Tư vấn sản phẩm</strong> qua <strong>hình ảnh & văn bản, đề xuất khuyến mãi, chốt đơn hiệu quả </strong> với khả năng <strong>tự động tạo kịch bản</strong> dẫn dắt khách hàng vượt trội.
                        </p>
                        <div className='flex gap-4'>
                            <Link href="/signin" className="btn col-span-4 xs:col-span-4 max-1xl:!px-3 max-1xl:!text-sm">
                                Dùng thử miễn phí
                            </Link>
                            <Link href="/request-a-demo" className="bg-primary px-5 flex items-center justify-center   rounded-full col-span-4 xs:col-span-4 max-1xl:!px-3 max-1xl:!text-sm">
                                Đặt lịch demo ngay
                            </Link>
                        </div>
                    </div>

                    <div className="col-span-12 md:col-span-6 lg:col-span-7 xl:ml-25">
                        <div className="relative flex align-center justify-center">
                            <div>
                                <div className="absolute inset-0 flex items-start justify-center max-md:flex-col -z-10 max-md:hidden">
                                    <div className="w-full h-[502px] rounded-full bg-primary-200/25 blur-[145px]"></div>
                                </div>

                                <div className="relative w-[296px] h-[566px] md:w-[200px] md:h-[375px] lg:w-[296px] lg:h-[566px]">
                                    <div className="w-full h-full">
                                        <Image
                                            src="/images/chatbot/chatbot-hero.png?v=1"
                                            alt="chatbot-hero"
                                            width={296}
                                            height={566}
                                            className="w-full h-full dark:hidden"
                                        />
                                        <Image
                                            src="/images/chatbot/chatbot-hero.png"
                                            alt="chatbot-hero-dark"
                                            width={296}
                                            height={566}
                                            className="w-full h-full hidden dark:inline-block"
                                        />
                                    </div>

                                    <div className="absolute  max-md:top-[150px] max-md:w-[330px] max-xs:left-[-30px] max-lg:-left-30 max-lg:top-[90px] max-lg:w-[230px] max-xl:w-[350px] max-xl:left-[-140px] max-1xl:w-[380px] top-[150px] left-[-220px]">
                                        <Image
                                            src="/images/chatbot/chatbot-hero-shape-1.png?v=2"
                                            alt="shape"
                                            width={380}
                                            height={380}
                                            className="dark:hidden"
                                        />
                                        <Image
                                            src="/images/chatbot/chatbot-hero-shape-1.png"
                                            alt="shape-dark"
                                            width={350}
                                            height={350}
                                            className="hidden dark:inline-block"
                                        />
                                    </div>

                                    <div className="absolute  max-xs:right-[-40px] max-md:w-[280px] max-md:top-[10px] max-lg:top-[5px] max-lg:right-[-100px] max-lg:w-[190px] max-1xl:w-[320px]  top-[80px] right-[-180px]">
                                        <Image
                                            src="/images/chatbot/chatbot-hero-shape-2.png"
                                            alt="shape"
                                            width={320}
                                            height={320}
                                            className="dark:hidden"
                                        />
                                        <Image
                                            src="/images/chatbot/chatbot-hero-shape-2.png"
                                            alt="shape-dark"
                                            width={350}
                                            height={250}
                                            className="hidden dark:inline-block"
                                        />
                                    </div>
                                    <div className="absolute max-md:w-auto max-md:h-auto max-md:top-[400px] max-xs:right-[-40px] max-lg:top-[270px] max-lg:right-[-120px]  max-lg:w-[180px] max-1xl:w-[250px] top-[420px] right-[-190px]">
                                        <Image
                                            src="/images/chatbot/chatbot-hero-shape-3.png"
                                            alt="shape-3"
                                            width={320}
                                            height={250}
                                            className="dark:hidden"
                                        />
                                        <Image
                                            src="/images/chatbot/chatbot-hero-shape-3.png"
                                            alt="shape-3-dark"
                                            width={250}
                                            height={250}
                                            className="hidden dark:inline-block"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section >
    );
}