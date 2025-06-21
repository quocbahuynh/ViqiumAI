"use client"

import { useState } from "react"
import { useAppDispatch } from "@/store/hooks"
import { updateProject, removeProject } from "@/store/slices/dashboard/projectsSlice"
import type { ProjectBase } from "@/types/projectType"

export const useProjectActions = () => {
  const dispatch = useAppDispatch()
  const [editingProject, setEditingProject] = useState<ProjectBase | null>(null)
  const [deletingProject, setDeletingProject] = useState<ProjectBase | null>(null)

  const openEditModal = (project: ProjectBase) => {
    setEditingProject(project)
  }

  const closeEditModal = () => {
    setEditingProject(null)
  }

  const openDeleteModal = (project: ProjectBase) => {
    setDeletingProject(project)
  }

  const closeDeleteModal = () => {
    setDeletingProject(null)
  }

  const handleUpdateSuccess = (updatedProject: ProjectBase) => {
    dispatch(updateProject(updatedProject))
    closeEditModal()
  }

  const handleDeleteSuccess = (projectId: string) => {
    dispatch(removeProject(projectId))
    closeDeleteModal()
  }

  return {
    // State
    editingProject,
    deletingProject,
    isEditModalOpen: !!editingProject,
    isDeleteModalOpen: !!deletingProject,

    // Actions
    openEditModal,
    closeEditModal,
    openDeleteModal,
    closeDeleteModal,
    handleUpdateSuccess,
    handleDeleteSuccess,
  }
}
