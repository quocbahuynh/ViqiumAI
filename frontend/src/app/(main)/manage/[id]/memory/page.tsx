"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { useAppSelector, useAppDispatch } from "@/store/hooks"
import { fetchMemories, deleteMemory, clearMemoryError } from "@/store/slices/memorySlice"
import { Search, Trash2, Info } from "lucide-react"
import PageBreadcrumb from "@/components/common/PageBreadCrumbCustom"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import type { Memory } from "@/types/chatType"
import ComponentCard from "@/components/common/ComponentCard"
import { Loader2 } from "lucide-react"
import { CardContent } from "@/components/ui/card"

export default function MemoryPage() {
  const params = useParams<{ id: string }>()
  const projectId = params?.id
  const dispatch = useAppDispatch()
  const memories = useAppSelector((state) => state.memory.data[projectId] || [])
  const status = useAppSelector((state) => state.memory.status[projectId] || "idle")
  const error = useAppSelector((state) => state.memory.error[projectId])

  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)

  // Fetch memories on mount
  useEffect(() => {
    if (projectId && status === "idle") {
      dispatch(fetchMemories(projectId))
    }
  }, [projectId, status, dispatch])

  // Clear error when component unmounts
  useEffect(() => {
    return () => {
      if (projectId) {
        dispatch(clearMemoryError(projectId))
      }
    }
  }, [projectId, dispatch])

  const handleOpenDeleteDialog = (memory: Memory) => {
    setSelectedMemory(memory)
    setIsDeleteDialogOpen(true)
  }

  const handleOpenDetailDialog = (memory: Memory) => {
    setSelectedMemory(memory)
    setIsDetailDialogOpen(true)
  }

  const handleDelete = () => {
    if (selectedMemory && projectId) {
      dispatch(
        deleteMemory({
          projectId,
          memoryId: selectedMemory._id,
        })
      )
      setIsDeleteDialogOpen(false)
      setSelectedMemory(null)
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-120px)]">
      <PageBreadcrumb pageTitle="Bộ nhớ AI" />

      <ComponentCard className=" rounded-2xl overflow-hidden">
        <div className="h-full flex flex-col">
          {/* Content */}
          <div className="flex-1 overflow-auto p-4">
            {status === "loading" ? (
              <div className="text-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-brand-500 mx-auto mb-4" />
                <p className="text-gray-600">Đang tải bộ nhớ...</p>
              </div>
            ) : status === "failed" ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto rounded-full bg-red-50 flex items-center justify-center mb-4">
                  <svg
                    className="h-8 w-8 text-red-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium mb-2 text-gray-800">Lỗi khi tải bộ nhớ</h3>
                <p className="text-sm text-gray-600">{error}</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => projectId && dispatch(fetchMemories(projectId))}
                >
                  Thử lại
                </Button>
              </div>
            ) : memories.length === 0 ? (

              <ComponentCard className="shadow-none">
                <CardContent className="flex flex-col items-center justify-center py-10">
                  <Search className="w-10 h-10 text-gray-400 dark:text-brand-300 mb-4" />
                  <h3 className="text-sm font-normal text-gray-400 dark:text-brand-300">Hiện chưa có kiến thức nào.</h3>
                                  <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => projectId && dispatch(fetchMemories(projectId))}
                >
                  Thử lại
                </Button>
                </CardContent>
              </ComponentCard>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {memories.map((memory) => (
                  <div
                    key={memory._id}
                    className="rounded-lg border border-gray-200 p-4 transition-colors cursor-pointer shadow-none"
                    onClick={() => handleOpenDetailDialog(memory)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium truncate text-gray-900">{memory.name}</h3>
                      <div className="flex items-center gap-1 ml-2" onClick={(e) => e.stopPropagation()}>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-red-500 hover:text-red-600 hover:bg-red-50"
                          onClick={() => handleOpenDeleteDialog(memory)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">{memory.content}</p>
                    <div className="mt-3 pt-2 border-t border-brand-50 flex justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs text-brand-600 hover:text-brand-700 hover:bg-brand-50 px-2 py-1 h-auto"
                      >
                        <Info className="h-3 w-3 mr-1" />
                        Xem chi tiết
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </ComponentCard>

      {/* Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-brand-700">{selectedMemory?.name}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-700 whitespace-pre-wrap">{selectedMemory?.content}</p>
          </div>
          <DialogFooter className="sm:justify-end">
            <Button variant="outline" onClick={() => setIsDetailDialogOpen(false)}>
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-red-600">Xóa bộ nhớ</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Bạn có chắc chắn muốn xóa bộ nhớ "<span className="font-semibold">{selectedMemory?.name}</span>"?</p>
            <p className="text-sm text-gray-500 mt-2">
              Hành động này sẽ xóa vĩnh viễn bộ nhớ và không thể hoàn tác.
            </p>
          </div>
          <DialogFooter className="sm:justify-end">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Hủy
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={status === "loading"}
            >
              {status === "loading" ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}