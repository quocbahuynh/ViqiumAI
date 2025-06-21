import { LightningBoltIcon } from '@radix-ui/react-icons'
import { Compass, CompassIcon, DraftingCompass, LinkIcon, Zap } from 'lucide-react'
import React from 'react'

export default function Commit() {
    return (
        <section className="bg-white dark:bg-dark-300 pb-150 pt-150 max-md:py-25 relative max-md:overflow-hidden">
            <div className="absolute left-0 right-0 top-25 bg-core-gradient bg-no-repeat bg-center opacity-70 w-full h-full bg-[length:600px_1000px] md:hidden" />
            <div className="container">
                <div className="mb-12 text-center max-w-[800px] mx-auto">
                    <p className="section-tagline">GIẢI PHÁP AI</p>
                    <h2>Hãy để Viqium AI cùng bạn kinh doanh</h2>
                </div>
                <div className="relative z-10">
                    <div className="absolute inset-0 flex items-center justify-center max-md:flex-col -z-10 max-md:hidden">
                        <div className="max-1xl:w-[335px] max-1xl:h-[335px]  1xl:w-[442px] 1xl:h-[442px]  rounded-full bg-primary-200/20 blur-[145px]" />
                        <div className="max-1xl:w-[335px] max-1xl:h-[335px]  1xl:w-[442px] 1xl:h-[442px]  rounded-full bg-primary-200/25 -ml-[170px] max-md:ml-0 blur-[145px]" />
                        <div className="max-1xl:w-[335px] max-1xl:h-[335px]  1xl:w-[442px] 1xl:h-[442px]  rounded-full bg-primary-200/20 -ml-[170px] max-md:ml-0 blur-[145px]" />
                    </div>
                    <div className=" grid grid-cols-3 max-md:grid-cols-1 gap-8">
                        <div className="bg-white dark:bg-dark-200 shadow-box rounded-medium p-2.5">
                            <div className="border border-dashed rounded border-gray-100 dark:border-borderColour-dark p-10 h-full max-lg:p-5  text-center ">
                                <LightningBoltIcon width={40} height={40} className=" inline-block dark:hidden mb-6" />
                                <img src="/images/payment/paymentFeature-dark.svg" alt="payment logo" className="hidden dark:inline-block mb-6" />
                                <h3 className="mb-2.5">Tinh gọn</h3>
                                <p>Viqium AI thay bạn tự động vận hành, chốt đơn nhanh gọn, chính xác.</p>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-dark-200 shadow-box rounded-medium p-2.5">
                            <div className="border border-dashed rounded border-gray-100 dark:border-borderColour-dark p-10 h-full max-lg:p-5  text-center">
                                <DraftingCompass width={40} height={40} className=" inline-block mb-6" />
                                <img src="images/payment/payementSecure-dark.svg" alt="payment logo" className="hidden dark:inline-block mb-6" />
                                <h3 className="mb-2.5">Dẫn dắt</h3>
                                <p>Viqium AI thông minh điều phối cuộc trò chuyện, tập trung đẩy khách hàng đến quyết định mua hàng.</p>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-dark-200 shadow-box rounded-medium p-2.5">
                            <div className="border border-dashed rounded border-gray-100 dark:border-borderColour-dark p-10 h-full max-lg:p-5  text-center">
                                <LinkIcon width={40} height={40} className="inline-block dark:hidden mb-6" />
                                <img src="images/payment/paymentCashback-dark.svg" alt="payment logo" className="hidden dark:inline-block mb-6" />
                                <h3 className="mb-2.5">Thấu hiểu</h3>
                                <p>Viqium AI doanh nghiệp hóa thông tin để nâng tầm doanh thu mỗi phút.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

    )
}
