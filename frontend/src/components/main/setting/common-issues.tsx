import { apiLinks } from "@/lib/api-link";
import axiosInstance from "@/lib/axios-config";
import {
  Package,
  Tag,
  AlertTriangle,
  Truck,
  Undo2,
  ShieldCheck,
  User,
  XCircle,
  MessageSquare,
  MoreHorizontal,
  LoaderCircle,
} from "lucide-react";
import { useEffect, useState } from "react";

const initIssues = [
  {
    id: 1,
    icon: <LoaderCircle className="h-5 w-5 text-purple-500" />,
    text: "Chưa có số liệu",
    count: 0,
  },
]


const labelsMap: any = {
  product: {
    lables: "Sản phẩm",
    color: "#88c13c",
    icon: <Package className="h-5 w-5 text-purple-500" />,
  },
  promotion: {
    lables: "Mua hàng",
    color: "#b1e346",
    icon: <Tag className="h-5 w-5 text-indigo-500" />,
  },
  pricing: {
    lables: "Giá cả",
    color: "#d0c93c",
    icon: <AlertTriangle className="h-5 w-5 text-amber-500" />,
  },
  shipping: {
    lables: "Hỗ trợ",
    color: "#d89d3c",
    icon: <Truck className="h-5 w-5 text-green-500" />,
  },
  return: {
    lables: "Đổi trả",
    color: "#7d59b3",
    icon: <Undo2 className="h-5 w-5 text-blue-500" />,
  },
  warranty: {
    lables: "Bảo hành",
    color: "#3cb1ac",
    icon: <ShieldCheck className="h-5 w-5 text-cyan-500" />,
  },
  humanRequest: {
    lables: "Con người",
    color: "#b1588a",
    icon: <User className="h-5 w-5 text-pink-500" />,
  },
  complaint: {
    lables: "Khiếu nại",
    color: "#c93f3f",
    icon: <XCircle className="h-5 w-5 text-red-500" />,
  },
  feedback: {
    lables: "Góp ý",
    color: "#a3a24c",
    icon: <MessageSquare className="h-5 w-5 text-lime-500" />,
  },
  others: {
    lables: "Khác",
    color: "#6a6c65",
    icon: <MoreHorizontal className="h-5 w-5 text-gray-500" />,
  },
};

const convertToIssueData = (obj: any) => {
  let i = 0;
  let issues = [];

  for (const key in obj) {

    if (obj[key] < 1) {
      continue;
    }

    const issue = {
      id: i,
      icons: labelsMap[key].icon,
      text: labelsMap[key].lables,
      count: obj[key],
    }
    issues.push(issue)

    i++;
  }

  return issues
};

interface CommonIssuesProp {
  projectId: string
}

export default function CommonIssues({ projectId }: CommonIssuesProp) {
  const [chartData, setChartData] = useState(initIssues);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(`${apiLinks.statistic.converstation}/${projectId}`);
        if (response.status == 200) {
          const data = await response.data;
          if (Object.keys(data).length > 0) {
            const format: any[] = convertToIssueData(data);
            setChartData(format)
          }

        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [projectId]);

  return (
    <div className="space-y-6 pb-3">
      {chartData.map((issue: any) => (
        <div key={issue.id} className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {issue.icon}
            <span className="text-sm">{issue.text}</span>
          </div>
          <div className="font-medium">{issue.count}</div>
        </div>
      ))}
    </div>
  )
}
