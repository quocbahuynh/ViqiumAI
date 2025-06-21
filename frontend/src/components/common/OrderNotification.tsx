"use client"

import { maskName } from "@/utils/showFakeOrder";
import { maskPhone } from "@/utils/showPhoneNumber";
import Image from "next/image";
import { ToastContentProps } from "react-toastify";

type OrderNotificationProps = Partial<ToastContentProps> & {
    name: string;
    time: Date;
    phone: string;
};


export function OrderNotification({ name, time, phone }: OrderNotificationProps) {

    const formattedTime = time.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
    });


    return (
        <div className="bg-white dark:bg-dark-200 shadow-box rounded-xs p-1.5 w-full">
            <div className="border border-dashed rounded border-gray-100 dark:border-borderColour-dark p-2.5 text-left">
                <div className="flex items-center gap-4">
                    <Image className="w-10 h-10 rounded-full" width={50} height={50} src="/logo.png" alt="" />
                    <div>
                        <p className="text-[14px] leading-[1.5]">Khách hàng: <strong>{maskName(name)}</strong> </p>
                        <p className="text-[14px] leading-[1.5]">Số điện thoại: <strong>{maskPhone(phone)}</strong> </p>
                        <p className="text-[14px] leading-[1.5]">Vừa đặt lịch Demo lúc <strong>{formattedTime}</strong> </p>
                    </div>
                </div>
            </div>
        </div>
    );
}