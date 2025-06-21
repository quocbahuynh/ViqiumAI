"use client"

import {  useState } from "react";
import { ArrowUpRight, Star } from "lucide-react";
import { useSession } from "next-auth/react";
import emailjs from '@emailjs/browser';

export default function FeedbackWidget() {
    const [open, setOpen] = useState(false);
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);
    const [rating, setRating] = useState(0);
    const [message, setMessage] = useState("");
    const [hideWidget, setHideWidget] = useState(false);
    const { data } = useSession();


    const sendEmail = async () => {
        if (rating === 0 || message.trim() === "") return;

        setSending(true);
        setOpen(false);

        const serviceId = `${process.env.NEXT_PUBLIC_EMAIL_SERVICE_ID}`;
        const publicKey = `${process.env.NEXT_PUBLIC_EMAIL_PUBLIC_KEY}`;

        const templateParams = {
            from_name: data?.user.profile?.fullName,
            from_email: data?.user.profile?.email,
            from_project: window.location.href,
            feed_back: message,
            star_rate: rating
        };

        emailjs.send(serviceId, "template_l4hk4h8", templateParams, publicKey)
            .then((response) => {
                console.log('Email sent successfully!', response);

                // Save localStorage to not show again
                setSent(true);
                setHideWidget(true); // hide permanently

                setRating(0);
                setMessage('');

                setTimeout(() => {
                    setSent(false)
                }, 1000);
            })
            .catch((error) => {
                setOpen(true);
                console.error('Error sending email:', error);
            })
            .finally(() => {
                setSending(false);
            });
    };

    if (hideWidget) return null;

    return (
        <>
            {/* Floating Button */}
            <button
                onClick={() => setOpen(!open)}
                className="fixed flex gap-2 bottom-4 right-4 bg-primary text-white text-sm px-4 py-2 rounded-full shadow-lg hover:bg-brand-500 z-50"
            >
                <ArrowUpRight color="white" className="w-4 h-4 text-white" />
                {(sending && !sent) && "Đang gửi đánh giá..."}
                {(!sending && !sent) && "Gửi đánh giá của bạn"}
                {sent && "Gửi đánh giá thành công!"}
            </button>

            {/* Popup Window */}
            {open && (
                <div className="fixed bottom-16 right-4 w-80 bg-white shadow-xl rounded-lg border p-4 z-50">
                    <h3 className="text-lg font-normal mb-3">Đánh giá của bạn</h3>

                    {/* Star Rating */}
                    <div className="flex mb-6 gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                                key={star}
                                className={`w-6 h-6 cursor-pointer transition-colors ${star <= rating ? "text-brand-400" : "text-gray-300"}`}
                                onClick={() => setRating(star)}
                                fill={star <= rating ? "currentColor" : "none"}
                            />
                        ))}
                    </div>

                    {/* Message Textarea */}
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Viết góp ý của bạn..."
                        className="w-full border rounded-md p-2 h-24 text-sm focus:outline-none focus:ring focus:border-brand-300 resize-none"
                    />

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-2 mt-3">
                        <button
                            onClick={() => setOpen(false)}
                            className="text-sm text-gray-500 hover:underline"
                        >
                            Hủy
                        </button>
                        <button
                            onClick={sendEmail}
                            className="bg-brand-600 text-white text-sm px-3 py-1 rounded hover:bg-brand-700"
                        >
                            Gửi
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
