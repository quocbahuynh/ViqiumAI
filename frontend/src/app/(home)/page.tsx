"use client"

import FakeOrderNotifier from "@/components/common/FakeOrderNotifier"
import Commit from "@/components/home/commit"
import Feature from "@/components/home/feature"
import Hero from "@/components/home/hero"
import Power from "@/components/home/power"
import Pricing from "@/components/home/pricing"
import ShowAnalysist from "@/components/home/show-analysist"
import Tryfree from "@/components/home/tryfree"
import UpgradePlanModal from "@/components/main/dashboard/UpgradePlanModal"
import { useEffect, useRef, useState } from "react"
import { ToastContainer } from "react-toastify"

export default function Home() {
  const [showModal, setShowModal] = useState(false)
  const [pricingVisible, setPricingVisible] = useState(false)
  const pricingRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !pricingVisible) {
            setPricingVisible(true)
          }
        })
      },
      {
        threshold: 0, // Trigger when 30% of pricing section is visible
        rootMargin: "0px 0px -100px 0px", // Trigger a bit before the section is fully visible
      },
    )

    if (pricingRef.current) {
      observer.observe(pricingRef.current)
    }

    return () => {
      if (pricingRef.current) {
        observer.unobserve(pricingRef.current)
      }
    }
  }, [pricingVisible])

  useEffect(() => {
    if (pricingVisible) {
      // Show modal after 4 seconds when pricing section becomes visible
      const timer = setTimeout(() => {
        setShowModal(true)
      }, 4000) // 4 seconds

      // Cleanup timer if component unmounts
      return () => clearTimeout(timer)
    }
  }, [pricingVisible])

  const handleCloseModal = () => {
    setShowModal(false)
  }

  return (
    <>
      <Hero />
      <Feature />
      <ShowAnalysist />
      <Power />
      <Pricing ref={pricingRef} />
      <Commit />
      <UpgradePlanModal isOpen={showModal} onClose={handleCloseModal} />
      <Tryfree />
      <FakeOrderNotifier />
      <ToastContainer position="bottom-left" pauseOnFocusLoss={false} limit={1} style={{ borderRadius: "100px" }} />
    </>
  )
}
