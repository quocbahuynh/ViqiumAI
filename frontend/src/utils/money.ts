// Format number as "x.xxx.xxx"
export const unformatCurrency = (value: string): number => {
    return parseInt(value.replace(/\D/g, ""), 10) || 0;
};

// Optional: format to Vietnamese dong style
export const formatCurrency = (value: any): string => {
    return value.toLocaleString('vi-VN');
};