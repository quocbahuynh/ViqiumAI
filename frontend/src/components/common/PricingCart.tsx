import { PricingPlan } from '@/types/pricingType'
import Link from 'next/link';
import React from 'react'

interface PricingCartProps {
    data: PricingPlan;
}

const CheckIcon = () => (
    <svg
        width={20}
        height={20}
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
    >
        <rect width={20} height={20} rx={10} fill="none" className="fill-primary" />
        <path
            d="M9.31661 13.7561L14.7491 8.42144C15.0836 8.0959 15.0836 7.5697 14.7491 7.24416C14.4145 6.91861 13.8736 6.91861 13.539 7.24416L8.7116 11.9901L6.46096 9.78807C6.12636 9.46253 5.58554 9.46253 5.25095 9.78807C4.91635 10.1136 4.91635 10.6398 5.25095 10.9654L8.1066 13.7561C8.27347 13.9184 8.49253 14 8.7116 14C8.93067 14 9.14974 13.9184 9.31661 13.7561Z"
            fill="none"
            className="fill-paragraph"
        />
    </svg>
)

const XIcon = () => (
    <svg
        width={20}
        height={20}
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
    >
        <rect width={20} height={20} rx={10} fill="none" className="fill-gray-300" />
        <path
            d="M13.5 6.5L6.5 13.5M6.5 6.5L13.5 13.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="stroke-gray-400"
        />
    </svg>
)

export default function PricingCart({ data }: PricingCartProps) {
    const isWhiteText = data.headerColor.includes("bg-purple-500") || data.headerColor.includes("bg-gray-600")
    return (
        <div className="bg-white dark:bg-dark-200 shadow-box rounded-medium p-2.5 ">
            <div className="border border-dashed rounded border-gray-100 dark:border-borderColour-dark p-8 max-md:p-5">
                {/* {
                    (savePercent > 0) && <div className="flex justify-end mb-2.5">
                        <span className=" -mr-4 bg-primary text-paragraph py-1.5 px-3 rounded-full font-medium"> Tiết kiệm {savePercent}% </span>
                    </div>
                } */}
                <div className="price-month mb-6">
                    <h2><span>{data.price}</span></h2>
                    <p>{data.period}</p>
                </div>

                <div className={`p-6 max-md:p-4 mb-8 max-md:mb-6 ${data.headerColor} rounded-lg`}>
                    <h3 className={`mb-2 max-md:text-lg ${isWhiteText ? "text-white" : ""}`}>{data.name}</h3>
                    <p className={`max-md:text-sm ${isWhiteText ? "text-white" : ""}`}>{data.description}</p>
                </div>

                <ul className=" relative after:absolute after:-top-12 after:h-0.5 after:w-full  after:bg-center after:bg-no-repeat after:bg-full">
                    {
                        data.features.map((f, i) =>
                            <li className="mb-6 flex items-center gap-3.5" key={i}>
                                {f.included ? <CheckIcon /> : <XIcon />}
                                <span>{i == 0 ? <strong>{f.text}</strong> : f.text}</span>
                            </li>)
                    }
                </ul>
                <Link href="/signup" className="btn-outline dark:bg-transparent text-center py-3 w-full">
                    Chọn gói này
                </Link>
            </div>
        </div>
    )
}

