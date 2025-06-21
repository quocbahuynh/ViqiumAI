import React, { useEffect, useState } from "react";

const CountdownTimer = () => {
    const [timeLeft, setTimeLeft] = useState(28 * 60); // 28 minutes in seconds

    useEffect(() => {
        if (timeLeft <= 0) return;

        const interval = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [timeLeft]);

    const formatTime = (seconds: any) => {
        const mins = String(Math.floor(seconds / 60)).padStart(2, "0");
        const secs = String(seconds % 60).padStart(2, "0");
        return `${mins}:${secs}`;
    };

    return (
        <div className="text-center py-6">
            <h1 className="text-4xl font-bold text-red-600 tracking-widest">
                {timeLeft > 0 ? formatTime(timeLeft) : "Sale Ended!"}
            </h1>
        </div>
    );
};

export default CountdownTimer;
