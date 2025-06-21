"use client"

import React, { useState } from 'react'
import axiosInstance from '@/lib/axios-config';
import { apiLinks } from '@/lib/api-link';
import { Modal } from '../ui/modal';
import { truncateText } from '@/utils/truncate';
import Link from 'next/link';
import FanpageMetaProjectCard from './FacbookMetaProjectCard';

interface FacebookConnectProp {
    setChooseFanpage: (fanpage: any) => void
    chooseFanpage: any
}

export default function FacebookConnectWidget({ setChooseFanpage, chooseFanpage }: FacebookConnectProp) {

    const [fanpageList, setFanpageList] = useState<any[]>([]);
    const [isFanpagesOpen, setIsFanpagesOpen] = useState(false);

    const openFanpagesModal = () => setIsFanpagesOpen(true);
    const closeFanpagesModal = () => setIsFanpagesOpen(false);


    const handleFacebookLogin = () => {
        if (!window.FB) return console.error('Facebook SDK not loaded');

        window.FB.login(
            (response: any) => {
                if (response.authResponse) {
                    const accessToken = response.authResponse.accessToken;
                    fetchPages(accessToken);
                }
            },
            {
                scope: 'public_profile,email,pages_messaging,pages_show_list,pages_manage_metadata,business_management',
            },
        );
    };

    const fetchPages = async (accessToken: string) => {
        try {
            const res = await axiosInstance.post(`${apiLinks.project.pagesList}/pages-list`, { accessToken });
            const pageList = await res.data.data;
            if (pageList.length > 0) {
                setFanpageList(pageList);
                openFanpagesModal();
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleDisconnectFB = async () => {
        setChooseFanpage(null)
    };

    return (
        <div className="mx-auto mt-3 mb-3 w-full rounded-2xl bg-brand-50 dark:bg-brand-500/10 px-3 py-3 text-center shadow-none dark:border-gray-700">
            <div className="flex flex-col items-center gap-3">

                {
                    (chooseFanpage) ? (<>
                        <>
                            <button
                                onClick={handleDisconnectFB}
                                className='flex btn rounded-0 text-white items-center gap-3 px-3 py-2'
                            >
                                <div className="w-5 h-5 sm:w-8 sm:h-8 rounded-full bg-brand-100 dark:bg-brand-900/20 flex items-center justify-center">
                                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M13.2131 9.78732c-.6359-.63557-1.4983-.99259-2.3974-.99259-.89911 0-1.76143.35702-2.39741.99259l-3.4253 3.42528C4.35719 13.8485 4 14.7108 4 15.61c0 .8992.35719 1.7616.99299 2.3974.63598.6356 1.4983.9926 2.39742.9926.89912 0 1.76144-.357 2.39742-.9926l.32157-.3043m-.32157-4.4905c.63587.6358 1.49827.993 2.39747.993.8991 0 1.7615-.3572 2.3974-.993l3.4243-3.42528c.6358-.63585.993-1.49822.993-2.39741 0-.89919-.3572-1.76156-.993-2.39741C17.3712 4.357 16.509 4 15.6101 4c-.899 0-1.7612.357-2.397.9925l-1.0278.96062m7.3873 14.04678-1.7862-1.7862m0 0L16 16.4274m1.7864 1.7863 1.7862-1.7863m-1.7862 1.7863L16 20" />
                                    </svg>

                                </div>
                                Hủy kết nối: {truncateText(chooseFanpage.fanpageName, 20)}
                            </button>
                            <div className="flex items-center gap-3 mt-1">
                                <div className="inline-block font-normal text-xs">
                                    <Link href={"/privacy"} target='_blank' className='!text-xs !underline !hover:text-primary'>Điều khoản dịch vụ</Link> &{" "}
                                    <Link href={"/terms-and-conditions"} target='_blank' className='!text-xs !underline !hover:text-primary'>Chính sách bảo mật</Link>
                                </div>
                            </div>
                        </>
                    </>) : (
                        <>
                            <button
                                type='button'
                                onClick={handleFacebookLogin}
                                className='flex btn rounded-0 text-white items-center gap-3 px-3 py-2 mt-3'
                            >
                                <div className="w-5 h-5 sm:w-8 sm:h-8 rounded-full bg-brand-100 dark:bg-brand-900/20 flex items-center justify-center">
                                    <svg
                                        className="w-5 h-5 sm:w-6 sm:h-6 text-white"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M13.135 6H15V3h-1.865a4.147 4.147 0 0 0-4.142 4.142V9H7v3h2v9.938h3V12h2.021l.592-3H12V6.591A.6.6 0 0 1 12.592 6h.543Z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </div>

                                <span className='text-white'>Kết nối Facebook Fanpage</span>
                            </button>

                            <div className="flex items-center gap-3 mt-1">
                                <div className="inline-block font-normal text-xs">
                                    <Link href={"/privacy"} target='_blank' className='!text-xs !underline !hover:text-primary'>Điều khoản dịch vụ</Link> &{" "}
                                    <Link href={"/terms-and-conditions"} target='_blank' className='!text-xs !underline !hover:text-primary'>Chính sách bảo mật</Link>
                                </div>
                            </div>
                        </>
                    )
                }

            </div>
            <Modal isOpen={isFanpagesOpen} onClose={closeFanpagesModal} className="fixed inset-0 z-51 p-5 lg:p-10 max-w-[700px] max-h-[70vh] overflow-y-auto">
                <h4 className="font-semibold text-gray-800 mb-7 text-title-sm dark:text-white/90">Kết nối Facebook Fanpage</h4>
                <div className="flex flex-col gap-3">
                    {fanpageList.map((f) => (
                        <FanpageMetaProjectCard
                            key={f.id}
                            fanpageName={truncateText(f.name, 20)}
                            accessToken={f.access_token}
                            avatarUrl={f.picture.data.url}
                            closeModal={closeFanpagesModal}
                            fanpageId={f.id}
                            setFanpageData={setChooseFanpage}
                        />
                    ))}
                </div>
            </Modal>
        </div>
    )
}
