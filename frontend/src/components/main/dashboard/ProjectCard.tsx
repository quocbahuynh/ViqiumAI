"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { truncateText } from "@/utils/truncate"
import { motion } from "framer-motion"
import type { ProjectBase } from "@/types/projectType"
import { ArrowUpRight } from "lucide-react"
import Image from "next/image"
import { Skeleton } from "@/components/ui/skeleton"
import { addBreadcrumb } from "@/store/slices/breadcrumb"
import { useAppDispatch } from "@/store/hooks"
import Link from "next/link"
import { ProjectActions } from "./ProjectActions"
interface ProjectCardProps {
  data: ProjectBase
  index: number
  onEdit: (project: ProjectBase) => void
  onDelete: (project: ProjectBase) => void
}

const ProjectCard = ({ data, index, onEdit, onDelete }: ProjectCardProps) => {
  const [isLink, setLink] = useState<any | null>(null)
  const router = useRouter()
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (data.fannpage) {
      setLink(data.fannpage)
    }
  }, [data])

  const handleAccessClick = () => {
    // Dispatch the breadcrumb item with the project's id and name
    dispatch(addBreadcrumb({ id: data._id, name: data.name }))
    setTimeout(function () { document.location.href = `/manage/${data._id}/statistic`; }, 250);
  }

  return (
    <div className="bg-white dark:bg-dark-200 rounded-medium p-2.5 shadow-nav hover:shadow-lg transition-transform duration-500 hover:transition-transform hover:duration-500">
      <div className="border border-dashed rounded border-gray-100 dark:border-borderColour-dark p-10 h-full max-lg:p-5">
        <div className="p-2.5 shadow-nav rounded-full w-[60px] h-[60px] bg-white dark:bg-dark-200 mb-6">
          <div className="flex items-center justify-center border border-dashed rounded-full w-[40px] h-[40px] border-gray-100 dark:border-borderColour-dark">
            <h3 className="text-primary dark:text-primary leading-none text-[28px]">
              {isLink ? (
                <Image
                  src="/images/connectedIcon.svg"
                  alt="Fanpage Avatar"
                  width={25}
                  height={25}
                  className=""
                />
              ) : (
                <Image
                  src="/images/disconnectIcon.svg"
                  alt="Fanpage Avatar"
                  width={25}
                  height={25}
                  className=""
                />
              )}
            </h3>
          </div>
        </div>

        <Link href="" className="block">
          <h3 className="mb-2.5">{truncateText(data.name, 19)}</h3>
        </Link>

        {isLink ? (
          <p className="mb-6 text-sm">
            <strong className="text-primary ">{truncateText(isLink.fanpageName, 38)}</strong>
          </p>
        ) : (
          <p className="mb-6 text-sm">
            Kết nối Fanpage: <strong>Chưa kết nối</strong>
          </p>
        )}

        <div className="flex items-center justify-between">

          <Link href={`/manage/${data._id}/statistic`}  target="_blank"
            className="cursor-pointer btn btn-sm flex gap-3 items-center text-white dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-green-500 dark:hover:border-green-500 transition-colors"
          >
            <ArrowUpRight color="white" className="w-4 h-4 text-white" />
            <span className="d-block  text-white">Truy cập</span>
          </Link>
          <ProjectActions project={data} onEdit={onEdit} onDelete={onDelete} />
        </div>
      </div>
    </div>
  )
}

// Skeleton loader for project cards

// Skeleton loader for project cards
export const ProjectCardSkeleton = ({ index }: { index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="bg-white dark:bg-dark-200 rounded-medium p-2.5 shadow-nav hover:shadow-lg transition-transform duration-500 hover:transition-transform hover:duration-500"
    >
      <div className="border border-dashed rounded border-gray-100 dark:border-borderColour-dark p-10 h-full max-lg:p-5">
        {/* Skeleton Icon Container */}
        <div className="p-2.5 shadow-nav rounded-full w-[60px] h-[60px] bg-white dark:bg-dark-200 mb-6">
          <div className="flex items-center justify-center border border-dashed rounded-full w-[40px] h-[40px] border-gray-100 dark:border-borderColour-dark">
            <Skeleton className="w-[35px] h-[35px] rounded-full" />
          </div>
        </div>

        {/* Skeleton Title */}
        <div className="mb-2.5">
          <Skeleton className="w-3/4 h-6" />
        </div>

        {/* Skeleton Description */}
        <div className="mb-6">
          <Skeleton className="w-full h-4 mb-1" />
          <Skeleton className="w-2/3 h-4" />
        </div>

        {/* Skeleton Footer */}
        <div className="flex items-center justify-between">
          {/* Skeleton Access Button */}
          <Skeleton className="w-24 h-10 rounded-lg" />

          {/* Skeleton Action Buttons */}
          <div className="flex gap-1">
            <Skeleton className="w-[40px] h-[40px] rounded-large" />
            <Skeleton className="w-[40px] h-[40px] rounded-large" />
          </div>
        </div>
      </div>
    </motion.div>
  )
}


interface ProjectListProps {
  data: ProjectBase[]
  isLoading?: boolean
  onEdit: (project: ProjectBase) => void
  onDelete: (project: ProjectBase) => void
}

export const ProjectList = ({ data, isLoading = false, onEdit, onDelete }: ProjectListProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-3 max-md:grid-cols-1 max-lg:grid-cols-2 gap-8">
        {[...Array(6)].map((_, i) => (
          <ProjectCardSkeleton key={i} index={i} />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-3 max-md:grid-cols-1 max-lg:grid-cols-2 gap-8">
      {data.map((p, i) => (
        <ProjectCard key={p._id || i} data={p} index={i} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  )
}
