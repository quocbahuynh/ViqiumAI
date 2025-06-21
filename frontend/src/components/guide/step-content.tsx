import Image from "next/image"

interface SubStep {
  title: string
  items: string[]
}

interface StepContentProps {
  id?: string  // <- required
  number?: number
  title?: string
  description?: string
  content: string[]
  subSteps?: SubStep[]
  image?: string
  tips?: string[]
}

export function StepContent({ id, number, title, description, content, subSteps, image, tips }: StepContentProps) {
  return (
    <section id={id} className="mb-150 scroll-mt-24 relative">
      {/* Background gradient effects similar to career-single */}

      <div className="container relative">
        {/* Step header with number badge */}
        <div className="flex items-start gap-6 mb-12 max-md:flex-col max-md:text-center">
          <div className="flex-shrink-0">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary text-white text-xl font-bold shadow-lg">
              {number}
            </div>
          </div>
          <div className="flex-1">
            <h2 className="text-3xl font-semibold mb-4 text-paragraph dark:text-white leading-tight">{title}</h2>
            <p className="text-lg text-paragraph-light dark:text-gray-300 leading-relaxed">{description}</p>
          </div>
        </div>

        {/* Featured image */}
        {image && (
          <div className="p-2.5 bg-transparent rounded-medium overflow-hidden  mb-12">
            <Image
              src={image || "/placeholder.svg"}
              alt={title|| "Step Image"}
              width={800}
              height={400}
              className="rounded w-full object-cover"
            />
          </div>
        )}

        {/* Main content - using blog-details styling */}
        <div className="blog-details-body mb-12">
          {content.map((paragraph, index) => (
            <p key={index} className="mb-6 text-paragraph dark:text-gray-300 leading-relaxed text-base">
              {paragraph}
            </p>
          ))}
        </div>

        {/* Sub-steps section */}
        {subSteps && subSteps.length > 0 && (
          <div className="mb-12">
            {subSteps.map((subStep, index) => (
              <div key={index} className="mb-8">
                <h3 className="text-xl font-semibold mb-6 text-paragraph dark:text-white">{subStep.title}</h3>
                <ul className="space-y-3">
                  {subStep.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start gap-3 text-paragraph dark:text-gray-300">
                      <span className="flex-shrink-0 w-2 h-2 bg-primary rounded-full mt-2"></span>
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {/* Tips section - styled like career-single sidebar */}
        {tips && tips.length > 0 && (
          <div className="bg-white dark:bg-dark-200 rounded-medium p-2.5 shadow-nav mb-12">
            <div className="bg-white dark:bg-dark-200 border border-dashed rounded border-gray-100 dark:border-borderColour-dark p-8 max-md:p-5">
              <h4 className="text-lg font-semibold mb-6 text-paragraph dark:text-white flex items-center gap-3">
                <svg className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
                Mẹo Hữu Ích
              </h4>
              <ul className="space-y-4">
                {tips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-3 text-paragraph dark:text-gray-300">
                    <span className="flex-shrink-0 w-2 h-2 bg-primary rounded-full mt-2"></span>
                    <span className="leading-relaxed">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
