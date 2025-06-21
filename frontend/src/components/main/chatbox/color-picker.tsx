"use client"

import Input from "@/components/form/input/InputField"
import { Label } from "@/components/ui/label"
import { HexColorPicker } from "react-colorful"

interface ColorPickerProps {
  color: string
  onChange: (color: string) => void
}

export function ColorPicker({ color, onChange }: ColorPickerProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="primaryColor">Màu chủ đạo</Label>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
        <div className="col-span-2">
          <HexColorPicker color={color} onChange={onChange} style={{ width: "100%", height: "180px" }} />
        </div>
        <div className="space-y-4">
          <div>
            <Label htmlFor="colorHex" className="mb-2">Mã màu HEX</Label>
            <Input id="colorHex" value={color} onChange={(e) => onChange(e.target.value)} />
          </div>
          <div>
            <div className="h-12 rounded-md border" style={{ backgroundColor: color }}></div>
          </div>
        </div>
      </div>
    </div>
  )
}
