"use client"
import { useEffect, useRef } from "react"
import { Label } from "@/components/ui/label"
import Button from "@/components/ui/button/Button"
import { Plus, Trash2, X } from 'lucide-react'
import CreatableSelect from "react-select/creatable"
import { useParams } from "next/navigation"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import {
  type SelectOption,
  fetchClassificationRecommendations,
  fetchOptionRecommendations,
  handleClassificationSelect,
  handleOptionSelect,
  addOption,
  removeOption,
  addClassification,
  removeClassification,
  clearError,
} from "@/store/slices/product/variantClassificationSlice"
import { updateClassifications } from "@/store/slices/product/productFormSlice"
import { Classification } from "@/types/productType"

interface VariantClassificationsProps {
  onChange: (classifications: Classification[]) => void
}

export default function VariantClassifications({ onChange }: VariantClassificationsProps) {
  const prevClassificationsRef = useRef<Classification[]>([])
  const params = useParams<{ id: string }>()
  const projectId = params?.id
  const dispatch = useAppDispatch()
  const isEditMode = true

  const {
    classifications,
    classificationOptions,
    optionRecommendations,
    isLoadingClassifications,
    isLoadingOptions,
    error,
  } = useAppSelector((state) => state.classification)

  useEffect(() => {
    if (projectId) {
      dispatch(fetchClassificationRecommendations(projectId))
    }
  }, [projectId, dispatch])

  useEffect(() => {
    const isEqual = JSON.stringify(classifications) === JSON.stringify(prevClassificationsRef.current)
    if (!isEqual || !isEditMode) {
      prevClassificationsRef.current = [...classifications]
      onChange(classifications)
    }
  }, [classifications, onChange, dispatch])

  const handleClassificationSelectChange = (index: number, selectedOption: SelectOption | null) => {
    dispatch(handleClassificationSelect({ classIndex: index, selectedOption }))
    if (selectedOption && !selectedOption.__isNew__) {
      dispatch(fetchOptionRecommendations({ classIndex: index, classificationId: selectedOption._id }))
    }
  }

  const handleOptionSelectChange = (classIndex: number, optionIndex: number, selectedOption: SelectOption | null) => {
    dispatch(handleOptionSelect({ classIndex, optionIndex, selectedOption }))
  }

  const handleAddOption = (classificationIndex: number) => {
    dispatch(addOption(classificationIndex))
  }

  const handleRemoveOption = (classificationIndex: number, optionIndex: number) => {
    dispatch(removeOption({ classIndex: classificationIndex, optionIndex }))
  }

  const handleRemoveClassification = (index: number) => {
    dispatch(removeClassification(index))
  }

  const handleAddClassification = () => {
    dispatch(addClassification())
  }

  const getFilteredClassificationOptions = (currentIndex: number) => {
    const selectedValues = classifications
      .filter((_, index) => index !== currentIndex)
      .map((classification) => classification.value)
      .filter((value): value is string => !!value)
    return classificationOptions.filter((option) => !selectedValues.includes(option.value))
  }

  const getFilteredOptionRecommendations = (classIndex: number, optionIndex: number) => {
    const selectedValues = classifications[classIndex].options
      .filter((_, index) => index !== optionIndex)
      .map((option) => option.value)
      .filter((value): value is string => !!value)
    const recommendations = optionRecommendations[classIndex] || []
    return recommendations.filter((option) => !selectedValues.includes(option.value))
  }

  const customStyles = {
    control: (provided: any, state: any) => ({
      ...provided,
      borderColor: state.isFocused ? "#3b82f6" : "#d1d5db",
      boxShadow: state.isFocused ? "0 0 0 2px rgba(59, 130, 246, 0.3)" : "none",
      "&:hover": { borderColor: state.isFocused ? "#3b82f6" : "#9ca3af" },
      borderRadius: "0.375rem",
      padding: "1px",
      minHeight: "36px",
      fontSize: "0.875rem",
      backgroundColor: "white",
      width: "100%",
    }),
    placeholder: (provided: any) => ({ ...provided, color: "#9ca3af", fontSize: "0.875rem" }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isSelected ? "#3b82f6" : state.isFocused ? "#eff6ff" : "white",
      color: state.isSelected ? "white" : "#374151",
      fontSize: "0.875rem",
      cursor: "pointer",
      padding: "6px 12px",
    }),
    menu: (provided: any) => ({
      ...provided,
      zIndex: 50,
      borderRadius: "0.375rem",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      marginTop: "2px",
      width: "100%",
    }),
    singleValue: (provided: any) => ({ ...provided, color: "#374151", fontSize: "0.875rem" }),
    valueContainer: (provided: any) => ({ ...provided, padding: "0px 8px" }),
    input: (provided: any) => ({ ...provided, margin: "0", padding: "0" }),
  }

  if (error) {
    return (
      <div className="text-red-500 text-sm p-4 border border-red-200 dark:border-red-700 rounded-lg bg-red-50 dark:bg-red-900/20">
        {error}
        <button onClick={() => dispatch(clearError())} className="ml-2 text-red-700 hover:text-red-800 font-medium">
          Đóng
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center mb-2">
        <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
        <Label className="font-medium text-gray-500 dark:text-gray-200">Phân loại hàng</Label>
      </div>

      {classifications.map((classification, classIndex) => (
        <div key={classification._id} className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center">
              <Label className="font-normal text-gray-500 dark:text-gray-300">Phân loại {classIndex + 1}</Label>
            </div>
            <div className="flex items-center">
              <button onClick={() => handleRemoveClassification(classIndex)} className="text-red-500 hover:text-red-600">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="mb-4">
            <CreatableSelect
              isClearable
              isSearchable
              placeholder="Ví dụ: Giới tính, Màu sắc, Kích thước..."
              formatCreateLabel={(inputValue) => `Tạo "${inputValue}"`}
              noOptionsMessage={() => "Không có gợi ý"}
              loadingMessage={() => "Đang tải..."}
              isLoading={isLoadingClassifications}
              options={getFilteredClassificationOptions(classIndex)}
              value={classification.label ? { label: classification.label, value: classification.value, _id: classification._id } : null}
              onChange={(newValue) => handleClassificationSelectChange(classIndex, newValue as SelectOption | null)}
              styles={customStyles}
            />
          </div>

          <div className="mb-2 flex justify-between items-center">
            <Label className=" font-normal text-gray-500 dark:text-gray-300">Tùy chọn</Label>
          </div>

          <div className="space-y-2">
            {[...Array(Math.ceil(classification.options.length / 2))].map((_, rowIndex) => (
              <div key={rowIndex} className="flex items-center gap-2 flex-wrap">
                {/* Ô select thứ nhất */}
                <div className="flex-1 min-w-[200px] relative">
                  <CreatableSelect
                    isClearable
                    isSearchable
                    placeholder="Nhập"
                    formatCreateLabel={(inputValue) => `Tạo "${inputValue}"`}
                    noOptionsMessage={() => "Không có gợi ý"}
                    loadingMessage={() => "Đang tải..."}
                    isLoading={isLoadingOptions[classIndex]}
                    options={getFilteredOptionRecommendations(classIndex, rowIndex * 2)}
                    value={
                      classification.options[rowIndex * 2]?.label
                        ? {
                            label: classification.options[rowIndex * 2].label,
                            value: classification.options[rowIndex * 2].value,
                            _id: classification.options[rowIndex * 2]._id,
                          }
                        : null
                    }
                    onChange={(newValue) => handleOptionSelectChange(classIndex, rowIndex * 2, newValue as SelectOption | null)}
                    styles={customStyles}
                  />
                  {classification.options.length > 1 && (
                    <button
                      onClick={() => handleRemoveOption(classIndex, rowIndex * 2)}
                      className="text-red-500 bg-white hover:text-red-600 p-1 absolute right-2 top-1/2 transform -translate-y-1/2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Ô select thứ hai (nếu có) */}
                {classification.options[rowIndex * 2 + 1] && (
                  <div className="flex-1 min-w-[200px] relative">
                    <CreatableSelect
                      isClearable
                      isSearchable
                      placeholder="Nhập"
                      formatCreateLabel={(inputValue) => `Tạo "${inputValue}"`}
                      noOptionsMessage={() => "Không có gợi ý"}
                      loadingMessage={() => "Đang tải..."}
                      isLoading={isLoadingOptions[classIndex]}
                      options={getFilteredOptionRecommendations(classIndex, rowIndex * 2 + 1)}
                      value={
                        classification.options[rowIndex * 2 + 1]?.label
                          ? {
                              label: classification.options[rowIndex * 2 + 1].label,
                              value: classification.options[rowIndex * 2 + 1].value,
                              _id: classification.options[rowIndex * 2 + 1]._id,
                            }
                          : null
                      }
                      onChange={(newValue) => handleOptionSelectChange(classIndex, rowIndex * 2 + 1, newValue as SelectOption | null)}
                      styles={customStyles}
                    />
                    {classification.options.length > 1 && (
                      <button
                        onClick={() => handleRemoveOption(classIndex, rowIndex * 2 + 1)}
                        className="text-red-500 bg-white hover:text-red-600 p-1 absolute right-2 top-1/2 transform -translate-y-1/2"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
            <Button
              onClick={() => handleAddOption(classIndex)}
              variant="outline"
              size="md"
              className="mt-2"
            >
              <Plus className="w-4 h-4" />
              Thêm tùy chọn
            </Button>
          </div>
        </div>
      ))}

      {classifications.length < 2 && (
        <Button
          onClick={handleAddClassification}
    >
          <Plus className="w-4 h-4 mr-2" />
          Thêm nhóm phân loại
        </Button>
      )}
    </div>
  )
}