"use client"

import { useState } from "react"
import { BlogCard } from "@/components/guide/blog-card"
import { Pagination } from "@/components/guide/pagination"
import { getAllGuides } from "@/constants/mock-guides"

export default function BlogListPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = 5
  const guides = getAllGuides()

  return (
    <>


      <section className="hero overflow-hidden relative max-lg:pt-150 pt-[240px] pb-[60px] z-40">
        <div className="container">
          <div className="max-w-[948px] mx-auto text-center">
            <p className="mb-4 font-medium uppercase">Hướng Dẫn</p>
            <h1 className="max-lg:mb-10 mb-10">
              Tài liệu hướng dẫn
            </h1>
            <p className="max-lg:mb-10 mb-12 max-w-[590px] mx-auto">
              Khám phá các hướng dẫn từng bước một cách chi tiết và dễ hiểu
            </p>
          </div>
        </div>
      </section>

      <section className="mb-150 relative">
        <div className="container relative">
          <div className="absolute left-1/2 top-20 -translate-x-1/2 -translate-y-1/2 flex max-md:flex-col -z-10 max-md:hidden">
            <div className="max-1xl:w-[335px] max-1xl:h-[335px] 1xl:w-[442px] 1xl:h-[442px] rounded-full bg-primary-200/20 blur-[145px]"></div>
            <div className="max-1xl:w-[335px] max-1xl:h-[335px] 1xl:w-[442px] 1xl:h-[442px] rounded-full bg-primary-200/25 -ml-[170px] max-md:ml-0 blur-[145px]"></div>
            <div className="max-1xl:w-[335px] max-1xl:h-[335px] 1xl:w-[442px] 1xl:h-[442px] rounded-full bg-primary-200/20 -ml-[170px] max-md:ml-0 blur-[145px]"></div>
          </div>
          <div className="grid max-md:gap-y-25 md:gap-5 lg:gap-8">
            <div className="max-md:col-span-full max-lg:col-span-7 max-md:order-2 lg:col-span-8 [&>*:not(:last-child)]:mb-8">
              {guides.map((guide) => (
                <BlogCard
                  key={guide.id}
                  id={guide.id}
                  title={guide.title}
                  author={guide.author}
                  date={guide.date}
                  category={guide.category}
                  image={guide.coverImage}
                  slug={guide.slug}
                  steps={guide.steps}
                  duration={guide.duration}
                />
              ))}

              {/* <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} /> */}
            </div>
          </div>
        </div>
      </section>

    </>
  )
}
