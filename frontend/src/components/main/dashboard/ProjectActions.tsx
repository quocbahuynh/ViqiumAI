"use client"
import { Edit, Trash } from "lucide-react"
import type React from "react"

import type { ProjectBase } from "@/types/projectType"

interface ProjectActionsProps {
  project: ProjectBase
  onEdit: (project: ProjectBase) => void
  onDelete: (project: ProjectBase) => void
}

export const ProjectActions = ({ project, onEdit, onDelete }: ProjectActionsProps) => {
  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onEdit(project)
  }

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onDelete(project)
  }

  return (
    <div className="flex gap-1">
      <button
        onClick={handleEditClick}
        className="border w-[40px] h-[40px] items-center justify-center flex rounded-large border-transparent hover:bg-white hover:border-borderColour dark:hover:bg-dark-200 dark:hover:border-borderColour/10 duration-500 hover:duration-500 transition-colors group"
        title="Chỉnh sửa dự án"
      >
        <Edit className="w-4 h-4" />
      </button>
      <button
        onClick={handleDeleteClick}
        className="border w-[40px] h-[40px] items-center justify-center flex rounded-large border-transparent hover:bg-white hover:border-borderColour dark:hover:bg-dark-200 dark:hover:border-borderColour/10 duration-500 hover:duration-500 transition-colors group"
        title="Xóa dự án"
      >
        <Trash className="w-4 h-4" />
      </button>
    </div>
  )
}
