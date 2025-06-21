"use client";

import { useEffect } from "react";
import { toast } from "react-toastify";
import { fakeNames } from "@/utils/showFakeOrder";
import { OrderNotification } from "./OrderNotification";
import { getRandomVietnamesePhoneNumber } from "@/utils/showPhoneNumber";

export default function FakeOrderNotifier() {
    const usedNames = new Set<string>();

    const showFakeOrder = () => {
        const delayInMinutes = Math.floor(Math.random() * 6) + 5; // 5–10 minutes
        const orderTime = new Date(Date.now() - delayInMinutes * 60 * 1000);

        const availableNames = fakeNames.filter(name => !usedNames.has(name));
        if (availableNames.length === 0) return;

        const name = availableNames[Math.floor(Math.random() * availableNames.length)];
        usedNames.add(name);

        const phoneNumber = getRandomVietnamesePhoneNumber();

        toast(<OrderNotification name={name} time={orderTime} phone={phoneNumber}/>, {
            autoClose: 5000,
            style: { padding: 0, border: 0 },
            pauseOnFocusLoss: false,
            hideProgressBar: true,
            closeOnClick: false,
            pauseOnHover: false,
            closeButton: false,
            position: "bottom-left",
        });
    };

    useEffect(() => {
        let timeoutId: NodeJS.Timeout;

        const getRandomDelay = () => Math.floor(Math.random() * 25000) + 15000; // 15s–40s

        const loop = () => {
            timeoutId = setTimeout(() => {
                showFakeOrder();
                loop();
            }, getRandomDelay());
        };

        loop(); // start on mount

        return () => clearTimeout(timeoutId);
    }, []);

    return null; // nothing rendered to DOM
}