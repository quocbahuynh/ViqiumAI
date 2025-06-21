import React from 'react'

export default function Tryfree() {
    return (
        <section className="relative pt-150 max-md:pt-25 pb-25 max-md:pb-25 overflow-hidden ">
            <div className="container relative shadow-lg  rounded-medium p-25">
                <div className=" text-center mx-auto ">
                    <h2 className="mb-5 max-lg:text-[32px] text-[48px] font-semibold ">Dùng thử miễn phí ngay hôm nay!
                    </h2>
                    <p className="max-lg:mt-6 mb-12 max-w-[400px] mx-auto">Liên hệ với chúng tôi để được hỗ trợ đăng ký</p>
                    <a href="signin" className="btn">
                        7 ngày miễn phí
                    </a>
                    <ul className=" flex max-lg:flex-col max-lg:gap-5  items-center justify-between max-lg:mt-5 mt-20 max-w-[815px] mx-auto">
                        <li className="flex items-center">
                            <svg width={20} height={20} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-3">
                                <path d="M14.125 7.75L8.62497 13L5.875 10.375M19 10C19 14.9706 14.9706 19 10 19C5.02944 19 1 14.9706 1 10C1 5.02944 5.02944 1 10 1C14.9706 1 19 5.02944 19 10Z" stroke="none" className="stroke-paragraph dark:stroke-primary" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <p>Miễn phí 7 ngày</p>
                        </li>
                        <li className="flex items-center">
                            <svg width={20} height={20} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-3">
                                <path d="M14.125 7.75L8.62497 13L5.875 10.375M19 10C19 14.9706 14.9706 19 10 19C5.02944 19 1 14.9706 1 10C1 5.02944 5.02944 1 10 1C14.9706 1 19 5.02944 19 10Z" stroke="none" className="stroke-paragraph dark:stroke-primary" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <p>Không yêu cầu tài khoản ngân hàng</p>
                        </li>
                        <li className="flex items-center">
                            <svg width={20} height={20} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-3">
                                <path d="M14.125 7.75L8.62497 13L5.875 10.375M19 10C19 14.9706 14.9706 19 10 19C5.02944 19 1 14.9706 1 10C1 5.02944 5.02944 1 10 1C14.9706 1 19 5.02944 19 10Z" stroke="none" className="stroke-paragraph dark:stroke-primary" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <p>Hỗ trợ 24/7</p>
                        </li>
                    </ul>
                </div>
            </div>
        </section>

    )
}
