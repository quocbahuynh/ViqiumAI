"use client"
import ComponentCard from '@/components/common/ComponentCard'
import PageBreadcrumb from '@/components/common/PageBreadCrumbCustom'
import Input from '@/components/form/input/InputField'
import Label from '@/components/form/Label'
import { Textarea } from '@/components/ui/textarea'
import { useSession } from 'next-auth/react'
import React, { useState } from 'react'
import emailjs from '@emailjs/browser';
import Button from '@/components/ui/button/Button'
import Alert from '@/components/ui/alert/Alert'

export default function FeedBack() {
    const [open, setOpen] = useState(false);
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);
    const [message, setMessage] = useState("");
    const [issueTitle, setIssueTitle] = useState("");
    const [issueDescription, setIssueDescription] = useState("");
    const [issueSolution, setIssueSolution] = useState("");

    const { data } = useSession();


    const sendEmail = async () => {
        if (!issueTitle.trim() && !issueDescription.trim() && !issueSolution.trim()) return;

        setSending(true);

        const serviceId = `${process.env.NEXT_PUBLIC_EMAIL_SERVICE_ID}`;
        const publicKey = `${process.env.NEXT_PUBLIC_EMAIL_PUBLIC_KEY}`;

        const formattedMessage = `
Tên vấn đề: ${issueTitle}

Mô tả vấn đề:
${issueDescription}

Ý kiến khắc phục:
${issueSolution}
  `;

        const templateParams = {
            from_name: data?.user?.profile?.fullName || "Ẩn danh",
            from_email: data?.user?.profile?.email || "Không rõ",
            from_project: window.location.href,
            feed_back: formattedMessage,
            star_rate: 0
        };

        emailjs.send(serviceId, "template_l4hk4h8", templateParams, publicKey)
            .then((response) => {
                console.log('Email sent successfully!', response);
                setSent(true);
                setIssueTitle('');
                setIssueDescription('');
                setIssueSolution('');

                setTimeout(() => {
                    setSent(false);
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


    return (
        <div>
            <PageBreadcrumb pageTitle="Đóng góp ý kiến" />
            <Alert
                variant="info"
                title="Cảm ơn bạn đã đóng góp ý kiến!"
                message="Đội ngũ phát triển trân trọng mọi ý kiến từ bạn. Mỗi đóng góp đều giúp chúng tôi cải thiện hệ thống và mang đến trải nghiệm tốt hơn. Xin chân thành cảm ơn!"
                showLink={false}
            />
            <div className='mt-3'>
                <ComponentCard title="Thông tin cơ bản">
                    <div className="space-y-1 grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <div className="col-span-2">
                            <Label>Tên vấn đề</Label>
                            <Input type="text" value={issueTitle} onChange={(e) => setIssueTitle(e.target.value)} />
                        </div>
                        <div className="col-span-2">
                            <Label>Mô tả vấn đề</Label>
                            <Textarea value={issueDescription} onChange={(e) => setIssueDescription(e.target.value)} />
                        </div>
                        <div className="col-span-2">
                            <Label>Ý kiến khắc phục</Label>
                            <Textarea value={issueSolution} onChange={(e) => setIssueSolution(e.target.value)} />
                        </div>
                        <div className="mt-6 flex justify-end">
                            <Button size="md" onClick={sendEmail} disabled={sending}>
                                {sending ? 'Đang gửi...' : 'Gửi ý kiến đóng góp'}
                            </Button>
                        </div>
                    </div>
                </ComponentCard>
            </div>

        </div>
    )
}
