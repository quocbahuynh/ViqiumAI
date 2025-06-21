"use client"
import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'

export default function Connect() {
    const logos = [
        { src: 'images/figma.svg', alt: 'Figma' },
        { src: 'images/dropbox.svg', alt: 'Dropbox' },
        { src: 'images/twitter.svg', alt: 'Twitter' },
        { src: 'images/slack.svg', alt: 'Slack' },
        { src: 'images/google-drive.svg', alt: 'Google Drive' },
        { src: 'images/asana.svg', alt: 'Asana' },
        { src: 'images/svelte.png', alt: 'Svelte' },
        { src: 'images/notion.png', alt: 'Notion' },
        { src: 'images/snapchat.svg', alt: 'Snapchat' },
        { src: 'images/reddit.png', alt: 'Reddit' },
    ]

    return (
        <section className="bg-white dark:bg-dark-300 pt-150 max-md:pb-20">
            <div className="container relative z-10">
                <div className="text-center max-w-[800px] mx-auto mb-10">
                    <p className="section-tagline">TÍCH HỢP</p>
                    <h2 className="mb-8">Kết nối nền tảng bán hàng</h2>
                    <p className="mb-10">
                        Viqium AI hứa hẹn sẽ triển khai kết nối tới các nền tảng bán hàng phổ biến.
                    </p>
                    <a href="contact.html" className="btn-outline">
                        Kết nối ngay
                    </a>
                </div>
            </div>

            <div className="integration-slider relative overflow-hidden">
                <div className="integration-slider-shape" />
                <div className="container pt-10">
                    <Swiper
                        spaceBetween={20}
                        slidesPerView={5}
                        centeredSlides={true}
                        loop={true}
                        breakpoints={{
                            320: { slidesPerView: 2 },
                            640: { slidesPerView: 3 },
                            768: { slidesPerView: 4 },
                            1024: { slidesPerView: 5 },
                        }}
                    >
                        {logos.map(({ src, alt }, i) => (
                            <SwiperSlide key={i} className="flex items-center aspect-square group">
                                <div className="bg-white dark:bg-dark-200 shadow-box p-2.5 w-20 aspect-square rounded-full mx-auto scale-100 origin-center group-[.swiper-slide-active]:scale-150 group-[.swiper-slide-active]:transition-transform group-[.swiper-slide-active]:duration-500 transition-transform duration-500">
                                    <div className="flex items-center justify-center border border-dashed border-gray-100 dark:border-borderColour-dark text-center aspect-square rounded-full">
                                        <img src={src} alt={alt} className="inline-block w-8 h-8" />
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
        </section>
    )
}
