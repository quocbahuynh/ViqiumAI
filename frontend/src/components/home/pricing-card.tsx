"use client"

import { useState } from "react"
import type { PricingPlan } from "@/types/pricingType"

// Update the interface to include plan index and all plans for comparison
interface PricingCardProps {
  plan: PricingPlan
  planIndex: number
  allPlans: PricingPlan[]
}

const CheckIcon = () => (
  <svg
    width={20}
    height={20}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="flex-shrink-0"
  >
    <rect width={20} height={20} rx={10} fill="none" className="fill-primary" />
    <path
      d="M9.31661 13.7561L14.7491 8.42144C15.0836 8.0959 15.0836 7.5697 14.7491 7.24416C14.4145 6.91861 13.8736 6.91861 13.539 7.24416L8.7116 11.9901L6.46096 9.78807C6.12636 9.46253 5.58554 9.46253 5.25095 9.78807C4.91635 10.1136 4.91635 10.6398 5.25095 10.9654L8.1066 13.7561C8.27347 13.9184 8.49253 14 8.7116 14C8.93067 14 9.14974 13.9184 9.31661 13.7561Z"
      fill="none"
      className="fill-paragraph"
    />
  </svg>
)

const XIcon = () => (
  <svg
    width={20}
    height={20}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="flex-shrink-0"
  >
    <rect width={20} height={20} rx={10} fill="none" className="fill-gray-300" />
    <path
      d="M13.5 6.5L6.5 13.5M6.5 6.5L13.5 13.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="stroke-gray-400"
    />
  </svg>
)

// Add this helper function after the XIcon component
const getUniqueIncludedFeatures = (plan: PricingPlan, planIndex: number, allPlans: PricingPlan[]) => {
  const currentIncludedFeatures = plan.features.filter((f) => f.included)

  if (planIndex === 0) {
    // First plan shows all its included features
    return currentIncludedFeatures
  }

  // For other plans, filter out features that are already included in previous plans
  const previousPlansFeatures = new Set<string>()

  for (let i = 0; i < planIndex; i++) {
    allPlans[i].features.filter((f) => f.included).forEach((f) => previousPlansFeatures.add(f.text))
  }

  return currentIncludedFeatures.filter((feature) => !previousPlansFeatures.has(feature.text))
}

// Update the component function signature
export default function PricingCard({ plan, planIndex, allPlans }: PricingCardProps) {
  const [showAllFeatures, setShowAllFeatures] = useState(false)
  const isWhiteText = plan.headerColor.includes("bg-purple-500") || plan.headerColor.includes("bg-gray-600")

  // Get unique features for this plan (not shown in previous plans)
  const uniqueIncludedFeatures = getUniqueIncludedFeatures(plan, planIndex, allPlans)
  const allIncludedFeatures = plan.features.filter((feature) => feature.included)
  const notIncludedFeatures = plan.features.filter((feature) => !feature.included)

  const maxIncludedFeatures = 7
  const hasMoreFeatures = allIncludedFeatures.length > uniqueIncludedFeatures.length || notIncludedFeatures.length > 0

  // Determine what features to display
  const displayedFeatures = showAllFeatures
    ? plan.features // Show all features when expanded
    : uniqueIncludedFeatures.slice(0, maxIncludedFeatures) // Show only unique included features

  // Calculate remaining features count
  const remainingUniqueCount = Math.max(0, uniqueIncludedFeatures.length - maxIncludedFeatures)
  const hiddenCommonFeaturesCount = allIncludedFeatures.length - uniqueIncludedFeatures.length
  const totalRemainingCount = remainingUniqueCount + hiddenCommonFeaturesCount + notIncludedFeatures.length

  return (
    <div className="bg-white dark:bg-dark-200 shadow-box rounded-medium p-2.5 flex-1 max-w-none lg:max-w-[400px]">
      <div className="border border-dashed rounded border-gray-100 dark:border-borderColour-dark p-8 max-md:p-5 h-full flex flex-col">
        <div className="price-month mb-7">
          <h2>
            <span className="max-md:text-2xl">{plan.price}</span>
          </h2>
          <p>{plan.period}</p>
        </div>

        <div className={`p-6 max-md:p-4 mb-8 max-md:mb-6 ${plan.headerColor} rounded-lg`}>
          <h3 className={`mb-2 max-md:text-lg ${isWhiteText ? "text-white" : ""}`}>{plan.name}</h3>
          <p className={`max-md:text-sm ${isWhiteText ? "text-white" : ""}`}>{plan.description}</p>
        </div>

        <div className="relative flex-1 mb-8 max-md:mb-6">
          <ul className="relative">
            {displayedFeatures.map((feature, index) => {
const isMessageLimit = feature.text.includes("tin nhắn/ngày") || feature.text.includes("Không giới hạn tin nhắn");

              return (
                <li key={index} className="mb-6 max-md:mb-4 flex items-center gap-3.5 max-md:gap-2">
                  {feature.included ? (
                    isMessageLimit ? (
                      <>
                        <CheckIcon />
                        <span className="max-md:text-sm font-bold text-primary-foreground">{feature.text}</span>
                      </>
                    ) : (
                      <>
                        <CheckIcon />
                        <span className="max-md:text-sm">{feature.text}</span>
                      </>
                    )
                  ) : (
                    <>
                      <XIcon />
                      <span className="max-md:text-sm text-gray-400">{feature.text}</span>
                    </>
                  )}
                </li>
              )
            })}
          </ul>

          {hasMoreFeatures && (
            <div className="mt-4">
              <button
                onClick={() => setShowAllFeatures(!showAllFeatures)}
                className="text-primary hover:text-primary/80 font-medium text-sm flex items-center gap-2 transition-colors duration-200"
              >
                {showAllFeatures ? (
                  <>
                    <span>Thu gọn</span>
                    <svg
                      width={16}
                      height={16}
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="transform rotate-180"
                    >
                      <path
                        d="M4 6L8 10L12 6"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </>
                ) : (
                  <>
                    <span>Xem tất cả các tính năng</span>
                    <svg width={16} height={16} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M4 6L8 10L12 6"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        <a
          href={plan.ctaLink}
          className={`${plan.ctaStyle === "primary" ? "btn" : "btn-outline"} dark:bg-transparent text-center py-3 w-full max-md:text-sm`}
        >
          {plan.ctaText}
        </a>
      </div>
    </div>
  )
}
