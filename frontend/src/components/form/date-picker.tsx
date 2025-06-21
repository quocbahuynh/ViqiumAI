import { useEffect, useRef } from 'react';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.css';
import Label from './Label';
import { CalenderIcon } from '../../icons';
import { Vietnamese } from "flatpickr/dist/l10n/vn.js";
import Hook = flatpickr.Options.Hook;
import DateOption = flatpickr.Options.DateOption;
import Instance = flatpickr.Instance;

type PropsType = {
  id: string;
  mode?: "single" | "multiple" | "range" | "time";
  onChange?: Hook | Hook[];
  defaultDate?: DateOption;
  label?: string;
  placeholder?: string;
  minDate?: string | Date;
  disabled?: boolean;
};

export default function DatePicker({
  id,
  mode,
  onChange,
  defaultDate,
  label,
  placeholder,
  minDate,
  disabled,
}: PropsType) {
  const pickerRef = useRef<Instance | Instance[] | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  console.log("dfakhdfjklahdjkhasjkdhsajkhdjkwahda", defaultDate)

  useEffect(() => {
    if (inputRef.current) {
      const config = {
        mode: mode || "single",
        static: true,
        monthSelectorType: "static" as const, // Explicitly type as "static"
        dateFormat: "d-m-Y",
        ...(defaultDate !== undefined && { defaultDate }),
        onChange,
        locale: Vietnamese,
        minDate,
        disable: disabled ? [() => true] : [],
      };

      pickerRef.current = flatpickr(inputRef.current, config);

      return () => {
        if (Array.isArray(pickerRef.current)) {
          pickerRef.current.forEach((instance) => instance.destroy());
        } else if (pickerRef.current) {
          pickerRef.current.destroy();
        }
      };
    }
  }, [mode, onChange, id, minDate, disabled, defaultDate]);

  // 👉 Cập nhật lại date khi defaultDate thay đổi
  useEffect(() => {
    if (pickerRef.current) {
      if (Array.isArray(pickerRef.current)) {
        pickerRef.current.forEach((instance) => {
          if (defaultDate !== undefined) {
            instance.setDate(defaultDate, false);
          }
        });
      } else {
        if (defaultDate !== undefined) {
          pickerRef.current.setDate(defaultDate, false);
        }
      }
    }
  }, [defaultDate]);

  return (
    <div>
      {label && <Label htmlFor={id}>{label}</Label>}

      <div className="relative">
        <input
          id={id}
          ref={inputRef}
          placeholder={placeholder}
          disabled={disabled}
          className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:focus:border-brand-800 disabled:opacity-50 disabled:cursor-not-allowed"
        />

        <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
          <CalenderIcon className="size-6" />
        </span>
      </div>
    </div>
  );
}