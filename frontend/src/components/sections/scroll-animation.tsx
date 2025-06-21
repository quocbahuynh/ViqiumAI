"use client"

import type React from "react"

import { useRef, useEffect, useState } from "react"
import { motion, useInView, useAnimation, type Variants } from "framer-motion"

// Custom hook to detect if an element is in viewport
export function useScrollInView(threshold = 0.1, once = true) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, {
    amount: threshold,
    once: once,
  })

  return { ref, isInView }
}

// Fade in animation component
export function FadeIn({
  children,
  delay = 0,
  direction = "up",
  className = "",
  threshold = 0.1,
  distance = 50,
  duration = 0.5,
  once = true,
}: {
  children: React.ReactNode
  delay?: number
  direction?: "up" | "down" | "left" | "right" | "none"
  className?: string
  threshold?: number
  distance?: number
  duration?: number
  once?: boolean
}) {
  const { ref, isInView } = useScrollInView(threshold, once)

  const directionMap = {
    up: { y: distance },
    down: { y: -distance },
    left: { x: distance },
    right: { x: -distance },
    none: { y: 0 },
  }

  const initial = direction === "none" ? { opacity: 0 } : { opacity: 0, ...directionMap[direction] }

  return (
    <motion.div
      ref={ref}
      initial={initial}
      animate={isInView ? { opacity: 1, x: 0, y: 0 } : initial}
      transition={{ duration: duration, delay: delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Stagger children animations
export function StaggerChildren({
  children,
  className = "",
  staggerDelay = 0.1,
  initialDelay = 0,
  threshold = 0.1,
}: {
  children: React.ReactNode
  className?: string
  staggerDelay?: number
  initialDelay?: number
  threshold?: number
}) {
  const { ref, isInView } = useScrollInView(threshold)

  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: initialDelay,
      },
    },
  }

  return (
    <motion.div
      ref={ref}
      variants={container}
      initial="hidden"
      animate={isInView ? "show" : "hidden"}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Stagger item to be used with StaggerChildren
export function StaggerItem({
  children,
  className = "",
  direction = "up",
  distance = 30,
}: {
  children: React.ReactNode
  className?: string
  direction?: "up" | "down" | "left" | "right"
  distance?: number
}) {
  const directionMap = {
    up: { y: distance, x: 0 },
    down: { y: -distance, x: 0 },
    left: { x: distance, y: 0 },
    right: { x: -distance, y: 0 },
  }

  const item: Variants = {
    hidden: { opacity: 0, ...directionMap[direction] },
    show: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  }

  return (
    <motion.div variants={item} className={className}>
      {children}
    </motion.div>
  )
}

// Parallax scroll effect
export function ParallaxScroll({
  children,
  className = "",
  speed = 0.5,
}: {
  children: React.ReactNode
  className?: string
  speed?: number
}) {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className={`${className} relative`} style={{ transform: `translateY(${scrollY * speed}px)` }}>
      {children}
    </div>
  )
}

// Scroll reveal animation
export function ScrollReveal({
  children,
  className = "",
  threshold = 0.1,
  direction = "left",
  distance = 100,
  delay = 0,
  duration = 0.6,
}: {
  children: React.ReactNode
  className?: string
  threshold?: number
  direction?: "left" | "right" | "up" | "down"
  distance?: number
  delay?: number
  duration?: number
}) {
  const { ref, isInView } = useScrollInView(threshold)

  const directionMap = {
    left: { x: -distance, y: 0 },
    right: { x: distance, y: 0 },
    up: { y: -distance, x: 0 },
    down: { y: distance, x: 0 },
  }

  return (
    <motion.div
      ref={ref}
      initial={{ ...directionMap[direction], opacity: 0 }}
      animate={isInView ? { x: 0, y: 0, opacity: 1 } : { ...directionMap[direction], opacity: 0 }}
      transition={{ duration: duration, delay: delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Scale animation on scroll
export function ScaleOnScroll({
  children,
  className = "",
  threshold = 0.1,
  initialScale = 0.9,
  delay = 0,
  duration = 0.5,
}: {
  children: React.ReactNode
  className?: string
  threshold?: number
  initialScale?: number
  delay?: number
  duration?: number
}) {
  const { ref, isInView } = useScrollInView(threshold)

  return (
    <motion.div
      ref={ref}
      initial={{ scale: initialScale, opacity: 0 }}
      animate={isInView ? { scale: 1, opacity: 1 } : { scale: initialScale, opacity: 0 }}
      transition={{ duration: duration, delay: delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Scroll counter animation
export function ScrollCounter({
  start = 0,
  end,
  duration = 2,
  delay = 0.2,
  prefix = "",
  suffix = "",
  className = "",
  threshold = 0.5,
}: {
  start?: number
  end: number
  duration?: number
  delay?: number
  prefix?: string
  suffix?: string
  className?: string
  threshold?: number
}) {
  const { ref, isInView } = useScrollInView(threshold, true)
  const [count, setCount] = useState(start)
  const controls = useAnimation()

  useEffect(() => {
    if (isInView) {
      let startTime: number
      let animationFrame: number

      const countUp = (timestamp: number) => {
        if (!startTime) startTime = timestamp
        const progress = Math.min((timestamp - startTime) / (duration * 1000), 1)
        const currentCount = Math.floor(progress * (end - start) + start)

        setCount(currentCount)

        if (progress < 1) {
          animationFrame = requestAnimationFrame(countUp)
        }
      }

      const startAnimation = () => {
        animationFrame = requestAnimationFrame(countUp)
      }

      const timeoutId = setTimeout(startAnimation, delay * 1000)

      return () => {
        clearTimeout(timeoutId)
        if (animationFrame) {
          cancelAnimationFrame(animationFrame)
        }
      }
    }
  }, [isInView, start, end, duration, delay])

  return (
    <div ref={ref} className={className}>
      {prefix}
      {count}
      {suffix}
    </div>
  )
}

// Scroll progress indicator
export function ScrollProgress() {
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.body.scrollHeight - window.innerHeight
      const progress = (window.scrollY / totalHeight) * 100
      setScrollProgress(progress)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="fixed top-0 left-0 right-0 h-1 z-50">
      <div className="h-full bg-sweetGreen-400" style={{ width: `${scrollProgress}%` }} />
    </div>
  )
}

// Text reveal animation
export function TextReveal({
  children,
  className = "",
  threshold = 0.1,
  staggerChildren = 0.03,
  staggerDelay = 0.1,
}: {
  children: string
  className?: string
  threshold?: number
  staggerChildren?: number
  staggerDelay?: number
}) {
  const { ref, isInView } = useScrollInView(threshold)

  const words = children.split(" ")

  const container: Variants = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: staggerChildren, delayChildren: staggerDelay * i },
    }),
  }

  const child: Variants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      variants={container}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      {words.map((word, index) => (
        <motion.span key={index} className="inline-block mr-1" variants={child}>
          {word}
        </motion.span>
      ))}
    </motion.div>
  )
}

// Mask reveal animation
export function MaskReveal({
  children,
  className = "",
  threshold = 0.1,
  direction = "left",
  duration = 1,
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  threshold?: number
  direction?: "left" | "right" | "up" | "down"
  duration?: number
  delay?: number
}) {
  const { ref, isInView } = useScrollInView(threshold)

  const directionMap = {
    left: { x: "-100%", y: "0%" },
    right: { x: "100%", y: "0%" },
    up: { x: "0%", y: "-100%" },
    down: { x: "0%", y: "100%" },
  }

  const variants = {
    hidden: { clipPath: `inset(0 0 0 0)` },
    visible: { clipPath: `inset(0 0 0 0)` },
  }

  const maskVariants = {
    hidden: { x: "0%", y: "0%" },
    visible: directionMap[direction],
  }

  return (
    <div ref={ref} className={`${className} relative overflow-hidden`}>
      <motion.div variants={variants} initial="hidden" animate={isInView ? "visible" : "hidden"}>
        {children}
        <motion.div
          className="absolute inset-0 bg-darkGreen-900"
          variants={maskVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          transition={{ duration, delay, ease: [0.77, 0, 0.18, 1] }}
        />
      </motion.div>
    </div>
  )
}
