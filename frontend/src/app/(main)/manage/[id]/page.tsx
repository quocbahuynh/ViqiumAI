"use client"

import ComponentCard from '@/components/common/ComponentCard'
import PageBreadcrumb from '@/components/common/PageBreadCrumbCustom'
import Alert from '@/components/ui/alert/Alert'
import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import axios from 'axios'
import { useEditor, EditorContent } from '@tiptap/react'
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import Button from '@/components/ui/button/Button'
import Bold from '@tiptap/extension-bold'
import { useSession } from 'next-auth/react'
import { apiLinks } from '@/lib/api-link'
import axiosInstance from '@/lib/axios-config'



const MenuBar = ({ editor, onSending }: any) => {
    if (!editor) {
        return null;
    }
    return (
        <div>
            <nav className="bg-white border-gray-200 dark:bg-gray-900">
                <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl"><Button
                    variant="outline"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={editor.isActive('bold') ? 'font-bold text-brand-600' : ''}
                >
                    In đậm
                </Button>
                    <div className="flex items-center space-x-3 rtl:space-x-reverse">

                        <Button variant='outline' size='sm' startIcon={<svg className="w-5 h-5 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3M3.22302 14C4.13247 18.008 7.71683 21 12 21c4.9706 0 9-4.0294 9-9 0-4.97056-4.0294-9-9-9-3.72916 0-6.92858 2.26806-8.29409 5.5M7 9H3V5" />
                        </svg>

                        }>Dùng văn mẫu</Button>
                        <Button variant='primary' disabled={onSending} size='sm' startIcon={<svg className="w-5 h-5 text-white dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.5 8H4m0-2v13a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1h-5.032a1 1 0 0 1-.768-.36l-1.9-2.28a1 1 0 0 0-.768-.36H5a1 1 0 0 0-1 1Z" />
                        </svg>
                        }>{onSending ? "Đang lưu..." : "Lưu thay đổi"}</Button>
                    </div>
                </div>
            </nav>
        </div>
    )
}


export default function InformationPage() {
    const params = useParams<{ id: string }>();
    const projectId = params.id;
    const { data: session } = useSession()
    const accessToken = session?.user.token?.accessToken;
    const [submitError, setSubmitError] = useState<boolean | null>(null);
    const [onSending, setOnSending] = useState(false);

    const editor = useEditor({
        extensions: [
            Document,
            Paragraph,
            Text, Bold],
        editorProps: {
            attributes: {
                class: `min-h-[500px] w-full border-top-0 px-4 py-2.5 text-md shadow-theme-xs focus:outline-hidden bg-transparent text-gray-700 border-gray-300 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10`
            }
        },
    })

    useEffect(() => {
        const fetchContent = async () => {
            if (!editor) return

            try {
                const response = await axiosInstance.get(`${apiLinks.project.getBaseInformation}/${projectId}`)
                const htmlContent = response.data?.data.baseInformation || '<p>Chưa có nội dung</p>'
                editor.commands.setContent(htmlContent, true)
            } catch (error) {
                console.error('Error fetching content:', error)
            }
        }
        if (accessToken) {
            fetchContent()
        }
    }, [editor, projectId, accessToken])


    const handleSave = async () => {
        if (!editor) return;

        const contentHTML = editor.getHTML();
        setOnSending(true);
        setSubmitError(null);

        try {
            await axiosInstance.put(`${apiLinks.project.updateBaseInformation}/${projectId}`, {
                baseInformation: contentHTML,
            });

            setSubmitError(false)
        } catch (error) {
            console.error('Error saving:', error);
            setSubmitError(true);
        } finally {
            setOnSending(false);
        }
    };


    return (
        <div>
            <PageBreadcrumb pageTitle="Thông tin doanh nghiệp" />
            <Alert
                variant="info"
                title="Cung cấp thông tin doanh nghiệp cho AI"
                message="Hãy mô tả doanh nghiệp của bạn — bao gồm sản phẩm, dịch vụ, quy mô và định hướng phát triển — để AI có thể tư vấn chính xác và phù hợp hơn."
                showLink={false}
            />
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-1 mt-3">
                <div className="space-y-6">
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        handleSave();
                    }}>
                        <ComponentCard title="Văn bản giới thiệu doanh nghiệp">
                            {submitError == true && (<Alert
                                variant="error"
                                title="Cập nhật thất bại!"
                                message="Lỗi hệ máy chủ."
                                showLink={false}
                            />)}
                            <div className='my-3'></div>
                            <MenuBar editor={editor} onSending={onSending} />
                            <div className="w-full rounded-lg bg-white ">
                                <EditorContent editor={editor} placeholder='Viết đoạn văn mô tả doanh nghiệp...' disabled={onSending} />
                            </div>
                        </ComponentCard>
                    </form>
                </div>
            </div>
        </div >
    )
}