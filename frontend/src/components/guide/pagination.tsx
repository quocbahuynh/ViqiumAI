"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const pages = Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1)

  return (
    <div className="mt-16">
      <ul className="flex items-center max-md:justify-center gap-2">
        <li className="group">
          <button
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="flex w-10 h-10 items-center justify-center border border-borderColour dark:border-borderColour-dark rounded-full hover:bg-primary duration-300 text-sm font-medium group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4 dark:group-hover:text-paragraph duration-300" />
          </button>
        </li>
        {pages.map((page) => (
          <li key={page} className={`group ${currentPage === page ? "page-active" : ""}`}>
            <button
              onClick={() => onPageChange(page)}
              className="flex w-10 h-10 items-center text-sm font-medium justify-center rounded-full hover:bg-primary duration-300 hover:text-paragraph group-[.page-active]:bg-primary dark:group-[.page-active]:text-paragraph"
            >
              {page}
            </button>
          </li>
        ))}
        <li className="group">
          <button
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="flex w-10 h-10 items-center justify-center border border-borderColour dark:border-borderColour-dark rounded-full hover:bg-primary duration-300 text-sm font-medium group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-4 h-4 dark:group-hover:text-paragraph duration-300" />
          </button>
        </li>
      </ul>
    </div>
  )
}
