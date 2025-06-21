import Image from "next/image"
import Link from "next/link"

interface BlogCardProps {
  id: string
  title: string
  author: string
  date: string
  category: string
  image: string
  slug: string
  steps?: number
  duration?: string
}

export function BlogCard({ title, author, date, category, image, slug, steps, duration }: BlogCardProps) {
  return (
    <article className="bg-white dark:bg-dark-200 rounded-medium p-2.5 shadow-nav scale-100 hover:scale-105 transition-transform duration-500 hover:transition-transform hover:duration-500">
      <div className="border border-dashed rounded border-gray-100 dark:border-borderColour-dark p-6 max-md:p-4">
        <div className="grid grid-cols-2 max-lg:grid-cols-1 gap-12 items-center">
       <Image
  src={image || "/placeholder.svg"}
  alt="guide image"
  width={400}
  height={400}
  className="w-full h-[200px] rounded-lg object-cover"
/>

          <div className="">
            <div className="badge">
              Hướng dẫn
            </div>
            <br/>
            <Link href={`/guide/${slug}`}>
              <h3 className="mb-1 font-semibold leading-[1.33]">{title}</h3>
            </Link>
            <div className="flex gap-x-2 items-center mb-2">
              <p>{author}</p>
              <span>
                <svg xmlns="http://www.w3.org/2000/svg" width="5" height="6" viewBox="0 0 5 6" fill="none">
                  <circle cx="2.5" cy="3" r="2.5" className="fill-[#D8DBD0] dark:fill-[#3B3C39]" />
                </svg>
              </span>
              <p>{date}</p>
            </div>
            {(steps || duration) && (
              <div className="flex gap-x-4 items-center mb-2 text-sm text-paragraph dark:text-gray-400">
                {steps && (
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>{steps} steps</span>
                  </div>
                )}
                {duration && (
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>{duration}</span>
                  </div>
                )}
              </div>
            )}
            <Link href={`/guide/${slug}`} className="btn-outline btn-sm">
              Start Guide
            </Link>
          </div>
        </div>
      </div>
    </article>
  )
}
