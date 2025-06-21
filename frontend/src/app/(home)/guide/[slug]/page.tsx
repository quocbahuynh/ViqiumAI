"use client"

import { HeroSection } from "@/components/guide/hero-section"
import { StepContent } from "@/components/guide/step-content"
import { StepGuideSidebar } from "@/components/guide/step-guide-sidebar"
import { ProgressBar } from "@/components/guide/progress-bar"
import { useParams } from "next/navigation"
import { getGuideBySlug } from "@/constants/mock-guides"


export default function GuidePageClient() {
  const slug: any = useParams<{ slug: string }>();
  const guide = getGuideBySlug(slug.slug);



  if (guide) {
    return (
      <>
        <ProgressBar totalSteps={guide.steps} />

        <HeroSection subtitle={guide.category} title={guide.title} />

        <section className="mb-150 relative">
          <div className="absolute left-1/2 -top-[250px] w-full h-[550px] -translate-x-1/2 bg-cover bg-[url('/placeholder.svg?height=550&width=800')] bg-no-repeat bg-center opacity-70 md:hidden -z-10"></div>

          <div className="container relative">
            <div className="grid grid-cols-12 max-lg:gap-y-25 lg:gap-16">
              {/* Main Content */}
              <div className="col-span-full max-lg:order-2 lg:col-span-8">
                {guide.steps_content.map((step: any) => (
                  <StepContent key={step.id} {...step} />
                ))}
              </div>

              {/* Sidebar */}
              <div className="col-span-full max-lg:order-1 lg:col-span-4">
                <StepGuideSidebar
                  steps={guide.steps_content.map((step: any) => ({
                    id: step.id,
                    title: step.title,
                    number: step.number,
                  }))}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="relative pb-25 max-md:overflow-hidden">
          <div className="container relative max-md:text-center">
            <div className="absolute left-1/2 -bottom-[442px] -translate-x-1/2 flex max-md:flex-col -z-10 max-md:hidden">
              <div className="max-md:hidden max-1xl:w-[335px] max-1xl:h-[335px] 1xl:w-[442px] rounded-full bg-primary-200/20 blur-[145px]"></div>
              <div className="max-1xl:w-[335px] max-1xl:h-[335px] 1xl:w-[442px] rounded-full bg-primary-200/25 -ml-[170px] max-md:ml-0 blur-[145px]"></div>
              <div className="max-1xl:w-[335px] max-1xl:h-[335px] 1xl:w-[442px] rounded-full bg-primary-200/20 -ml-[170px] max-md:ml-0 blur-[145px]"></div>
            </div>

            <div>
              <div>
                <p className="section-tagline">Hoàn thành hướng dẫn?</p>
              </div>
              <div className="grid grid-cols-12 grid-y-10 items-start">
                <div className="max-md:col-span-full md:col-span-6 lg:col-span-7">
                  <h2 className="mb-5 max-lg:text-[32px] text-[48px] font-semibold">Sẵn sàng cho thử thách tiếp theo?</h2>
                  <p>
                    Khám phá thêm nhiều hướng dẫn khác và tiếp tục hành trình học tập của bạn với các bài hướng dẫn toàn
                    diện.
                  </p>
                </div>
                <div className="max-md:col-span-full md:col-span-6 lg:col-span-5 max-md:mt-5">
                  <div className="flex flex-col gap-4">
                    <button className="btn w-full">Xem Thêm Hướng Dẫn</button>
                    <button className="btn-outline w-full">Chia Sẻ Hướng Dẫn</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

      </>
    )
  }
}
