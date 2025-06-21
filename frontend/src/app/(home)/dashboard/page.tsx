"use client"
import { useEffect, useState } from "react"
import { Plus } from "lucide-react"
import type { ProjectBase } from "@/types/projectType"
import { ProjectList } from "@/components/main/dashboard/ProjectCard"
import { ProjectModals } from "@/components/main/dashboard/ProjectModals"
import { EmptyProjectState } from "@/components/main/dashboard/EmptyProjectState"
import { ErrorProjectState } from "@/components/main/dashboard/ErrorProjectState"
import CreateAIModal from "@/components/main/dashboard/CreateProjectCard"
import UpgradePlanModal from "@/components/main/dashboard/UpgradePlanModal"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { addProject, fetchProjects } from "@/store/slices/dashboard/projectsSlice"
import { useProjectActions } from "@/hooks/use-project-actions"
import { useSession } from "next-auth/react"

export default function PlaygroundPage() {
  const dispatch = useAppDispatch()
  const { projects, status, error } = useAppSelector((state) => state.projects)

  // Use custom hook for project actions
  const {
    editingProject,
    deletingProject,
    isEditModalOpen,
    isDeleteModalOpen,
    openEditModal,
    closeEditModal,
    openDeleteModal,
    closeDeleteModal,
    handleUpdateSuccess,
    handleDeleteSuccess,
  } = useProjectActions()

  const [searchQuery, setSearchQuery] = useState<string>("")
  const [openCreateModal, setOpenCreateModal] = useState<boolean>(false)
  const [isSearching, setIsSearching] = useState<boolean>(false)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showUpgradeModal, setShowUpgradeModal] = useState<boolean>(false)

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchProjects())
    }
  }, [status, dispatch])

  const handleNewProject = (newProject: ProjectBase) => {
    dispatch(addProject(newProject))
  }

  const handleError = (error: string) => {
    console.error("Error fetching projects:", error)
    // Show upgrade modal when error occurs (assuming it's a plan limit error)
    setShowUpgradeModal(true)
  }

  const handleRetry = () => {
    dispatch(fetchProjects())
  }

  const handleCreateProject = () => {
    setOpenCreateModal(true)
  }

  const handleCloseUpgradeModal = () => {
    setShowUpgradeModal(false)
  }

  const isLoading = status === "loading"
  const hasError = status === "failed"
  const hasProjects = projects.length > 0
  const isEmpty = !isLoading && !hasError && !hasProjects

  return (
    <>
      <section className="hero overflow-hidden relative max-lg:pt-150 pt-[200px] pb-[60px] z-40">
        <div className="container">
          <div
            className="mx-auto text-left"
            data-aos="fade-up"
            data-aos-offset={200}
            data-aos-duration={1000}
            data-aos-once="true"
          >
            <p className="mb-4 font-medium uppercase">DANH SÁCH DỰ ÁN</p>
            <div className="items-center flex justify-between max-md:flex-col max-md:items-start max-md:gap-4">
              <h1 className="d-block max-lg:mb-10 max-md:mb-0 mb-10">Quản lý AI</h1>
              <button
                onClick={handleCreateProject}
                className="flex items-center btn btn-sm max-md:w-full max-md:justify-center"
              >
                <Plus className="w-4 h-4 mr-2 text-white" color="#FFF" />
                Tạo AI
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white dark:bg-dark-300 pb-150 max-md:pb-20 relative max-sm:overflow-hidden min-h-[500px]">
        <div className="absolute left-0 right-0 -top-[200px] bg-service-bg bg-no-repeat bg-cover bg-center opacity-70 w-full h-full sm:hidden" />
        <div className="container">
          <div className="relative z-10">
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex max-md:flex-col -z-10 max-sm:hidden">
              <div className="max-md:h-[750px] max-1xl:w-[335px] max-1xl:h-[335px] 1xl:w-[442px] 1xl:h-[442px] rounded-full bg-primary-200/20 blur-[145px]" />
              <div className="max-md:h-[750px] max-1xl:w-[335px] max-1xl:h-[335px] 1xl:w-[442px] 1xl:h-[442px] rounded-full bg-primary-200/25 -ml-[170px] max-md:ml-0 blur-[145px]" />
              <div className="max-md:h-[750px] max-1xl:w-[335px] max-1xl:h-[335px] 1xl:w-[442px] 1xl:h-[442px] rounded-full bg-primary-200/20 -ml-[170px] max-md:ml-0 blur-[145px]" />
            </div>

            {/* Loading State */}
            {isLoading && <ProjectList isLoading={true} data={[]} onEdit={openEditModal} onDelete={openDeleteModal} />}

            {/* Error State */}
            {hasError && <ErrorProjectState error={error || undefined} onRetry={handleRetry} />}

            {/* Empty State */}
            {isEmpty && <EmptyProjectState onCreateProject={handleCreateProject} />}

            {/* Projects List */}
            {hasProjects && <ProjectList data={projects} onEdit={openEditModal} onDelete={openDeleteModal} />}
          </div>
        </div>
      </section>

      {/* Create Project Modal */}
      <CreateAIModal
        isOpen={openCreateModal}
        onClose={() => setOpenCreateModal(false)}
        onError={handleError}
        onSuccess={handleNewProject}
      />

      {/* Edit and Delete Modals */}
      <ProjectModals
        editingProject={editingProject}
        deletingProject={deletingProject}
        isEditModalOpen={isEditModalOpen}
        isDeleteModalOpen={isDeleteModalOpen}
        onCloseEdit={closeEditModal}
        onCloseDelete={closeDeleteModal}
        onUpdateSuccess={handleUpdateSuccess}
        onDeleteSuccess={handleDeleteSuccess}
      />

      {/* Upgrade Plan Modal */}
      <UpgradePlanModal isOpen={showUpgradeModal} onClose={handleCloseUpgradeModal} />
    </>
  )
}
