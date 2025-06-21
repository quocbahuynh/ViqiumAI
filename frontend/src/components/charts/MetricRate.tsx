import { apiLinks } from '@/lib/api-link';
import axiosInstance from '@/lib/axios-config';
import React, { useEffect, useState } from 'react'
import MetricCard from '../main/setting/metric-card';
import { ArrowUpRight, MessageSquare, User } from 'lucide-react';

interface StatisticsRate {
    aiAutomationRate: string;
    humanRequest: string;
    orderRate: string;
};

interface MetricRateProp {
    projectId: string;
}

export default function MetricRate({ projectId }: MetricRateProp) {

    const [orderRate, setOrderRate] = useState<StatisticsRate>({
        "aiAutomationRate": "0%",
        "humanRequest": "0%",
        "orderRate": "0%"
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosInstance.get(`${apiLinks.statistic.numberRate}/${projectId}`);
                if (response.status == 200) {
                    const data: StatisticsRate = await response.data
                    setOrderRate(data)
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [projectId]);

    return (
        <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-3">
            <MetricCard
                background="#f3f7ec"
                title="Tỷ lệ chuyển đổi"
                value={orderRate.orderRate}
                description="Hội thoại dẫn đến đơn hàng"
                icon={<ArrowUpRight className="h-4 w-4 text-dark" />}
            />
            <MetricCard
                background="#b1e346"
                title="Tự động xử lý"
                value={orderRate.aiAutomationRate}
                description="AI xử lý đơn hàng"
                icon={<MessageSquare className="h-4 w-4 text-dark" />}
            />
            <MetricCard
                background="#222020"
                title="Chuyển giao"
                value={orderRate.humanRequest}
                description="Con người xử lý đơn hàng"
                icon={<User className="h-4 w-4 text-white" />}
            />
        </div>
    )
}
