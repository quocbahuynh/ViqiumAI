"use client"
import EditProjectModal from "./EditProjectModal"
import DeleteProjectConfirmation from "./DeleteProjectConfirmation"
import type { ProjectBase } from "@/types/projectType"

interface ProjectModalsProps {
  editingProject: ProjectBase | null
  deletingProject: ProjectBase | null
  isEditModalOpen: boolean
  isDeleteModalOpen: boolean
  onCloseEdit: () => void
  onCloseDelete: () => void
  onUpdateSuccess: (updatedProject: ProjectBase) => void
  onDeleteSuccess: (projectId: string) => void
}

export const ProjectModals = ({
  editingProject,
  deletingProject,
  isEditModalOpen,
  isDeleteModalOpen,
  onCloseEdit,
  onCloseDelete,
  onUpdateSuccess,
  onDeleteSuccess,
}: ProjectModalsProps) => {
  return (
    <>
      {/* Edit Modal */}
      <EditProjectModal
        isOpen={isEditModalOpen}
        onClose={onCloseEdit}
        onSuccess={onUpdateSuccess}
        project={editingProject}
      />

      {/* Delete Confirmation Modal */}
      <DeleteProjectConfirmation
        isOpen={isDeleteModalOpen}
        onClose={onCloseDelete}
        onSuccess={onDeleteSuccess}
        project={deletingProject}
      />
    </>
  )
}
