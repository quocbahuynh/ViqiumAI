"use client";
import React, { useEffect, useState } from "react";
import {
  Select as ShadcnSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // Đường dẫn đến component Select của shadcn/ui

export interface Option {
  value: string;
  label: string;
}

interface SelectProps {
  options: Option[];
  placeholder?: string;
  onChange: (value: string) => void;
  className?: string;
  defaultValue?: string;
  label?: string;
  disabled?: boolean;
}

const Select: React.FC<SelectProps> = ({
  options,
  placeholder = "Select an option",
  onChange,
  className = "",
  defaultValue = "",
  label = "",
  disabled = false,
}) => {
  const [selectedValue, setSelectedValue] = useState<string>(defaultValue);

  // Đồng bộ defaultValue
  useEffect(() => {
    setSelectedValue(defaultValue);
  }, [defaultValue]);

  const handleChange = (value: string) => {
    setSelectedValue(value);
    onChange(value);
  };

  return (
    <div className="w-full">
      {label && (
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-400">
          {label}
        </label>
      )}
      <ShadcnSelect
        value={selectedValue}
        onValueChange={handleChange}
        disabled={disabled}
      >
        <SelectTrigger
          className={`h-10 w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm outline-hidden transition focus:border-brand-300 dark:border-gray-700 dark:bg-gray-900 dark:focus:border-brand-300 ${
            disabled ? "bg-gray-100 cursor-not-allowed" : ""
          } ${selectedValue ? "text-gray-800 dark:text-white/90" : "text-gray-400 dark:text-gray-400"} ${className}`}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="z-50 w-full bg-white rounded-lg shadow-lg dark:bg-gray-900">
          {options.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              className="hover:bg-gray-100 dark:hover:bg-gray-800 text-sm text-gray-800 dark:text-white/90 focus:bg-gray-50 dark:focus:bg-gray-700"
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </ShadcnSelect>
    </div>
  );
};

export default Select;