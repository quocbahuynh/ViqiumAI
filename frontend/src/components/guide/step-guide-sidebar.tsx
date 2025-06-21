"use client"

import { useEffect, useState } from "react"

interface Step {
  id?: string
  title?: string
  number?: number
}

interface StepGuideSidebarProps {
  steps: Step[]
}

export function StepGuideSidebar({ steps }: StepGuideSidebarProps) {
  const [activeStep, setActiveStep] = useState<string>(steps[0]?.id || "")

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200

      for (const step of steps) {
        const element = document.getElementById(step.id|| "")
        if (element) {
          const { offsetTop, offsetHeight } = element
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveStep(step.id|| "")
            break
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [steps])

  const scrollToStep = (stepId: string) => {
    const element = document.getElementById(stepId)
    if (element) {
      const offsetTop = element.offsetTop - 100
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      })
    }
  }

  return (
    <div className="bg-white dark:bg-dark-200 rounded-medium p-2.5 shadow-nav sticky top-24">
      <div className="bg-white dark:bg-dark-200 border border-dashed rounded border-gray-100 dark:border-borderColour-dark p-6">
        <h3 className="mb-6 text-lg font-semibold">Mục lục</h3>
        <nav className="flex flex-col gap-3">
          {steps.map((step) => (
            <button
              key={step.id}
              onClick={() => scrollToStep(step.id|| "")}
              className={`w-full text-left p-2 rounded-full  transition-all duration-300 flex items-center gap-3 ${activeStep === step.id
                  ? "bg-primary text-white"
                  : "hover:bg-gray-50 dark:hover:bg-dark-300 text-paragraph dark:text-white"
                }`}
            >
              <span
                className={`flex items-center justify-center w-9 h-9 rounded-full text-sm font-medium ${activeStep === step.id ? "bg-white text-primary" : "bg-primary text-white"
                  }`}
              >
                {step.number}
              </span>
              <span className="font-medium">{step.title}</span>
            </button>
          ))}
        </nav>

      </div>
    </div>
  )
}
