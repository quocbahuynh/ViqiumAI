"use client"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import UserDropdown from "./user-dropdown"
import Image from "next/image"

const navItems = [
  {
    label: "Trang chủ",
    href: "/",
  },
  {
    label: "Hướng dẫn",
    href: "/guide",
  },
  {
    label: "Phí dịch vụ",
    href: "/pricing",
  },
  {
    label: "Hỗ trợ",
    href: "/support",
  },
  {
    label: "Đội ngũ phát triển",
    href: "/team",
  },
]

export default function Header() {
  const { data: session, status } = useSession()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Consolidated scroll handler
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.pageYOffset
      setIsScrolled(scrollPosition > 50)

      const topNav = document.getElementById("top-nav")
      const navBar = document.getElementById("mainnavigationBar")

      if (!navBar) return

      if (scrollPosition >= 100) {
        navBar.classList.add("nav-sticky")
        if (topNav) {
          topNav.classList.add("scale-y-0", "origin-top")
          topNav.classList.remove("scale-y-100")
        }
      } else {
        navBar.classList.remove("nav-sticky")
        if (topNav) {
          topNav.classList.remove("scale-y-0", "origin-top")
          topNav.classList.add("scale-y-100", "origin-top")
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Lấy tên hiển thị từ session
  const getDisplayName = () => {
    if (!session?.user) return ""
    return session.user.profile?.fullName || session.user.name || session.user.email?.split("@")[0] || "User"
  }

  // Lấy chữ cái đầu tiên của tên
  const getInitials = (name: string) => {
    if (!name) return "U"
    const names = name.trim().split(" ")
    if (names.length >= 2) {
      return (names[0][0] + names[names.length - 1][0]).toUpperCase()
    }
    return name[0]?.toUpperCase() || "U"
  }

  const displayName = getDisplayName()
  const initials = getInitials(displayName)

  // Toggle mobile menu
  const toggleMobileMenu = (e:any) => {

    setIsMobileMenuOpen(!isMobileMenuOpen)
    console.log("Mobile menu toggled:", !isMobileMenuOpen)

    // Prevent body scroll when menu is open
    if (!isMobileMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
  }

  // Cleanup body scroll when component unmounts or menu closes
  useEffect(() => {
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [])

  useEffect(() => {
    if (!isMobileMenuOpen) {
      document.body.style.overflow = "unset"
    }
  }, [isMobileMenuOpen])

  const mobileMenuStyles = `
  .mobile-menu {
    position: fixed;
    right: 0px;
    top: 0px;
    z-index: 111111;
    margin-left: auto;
    margin-right: auto;
    display: flex;
    height: 100vh;
    width: 100%;
    --tw-translate-x: 100%;
    transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
    align-items: center;
    border-radius: 0px;
    --tw-bg-opacity: 1;
    background-color: rgb(177 227 70 / var(--tw-bg-opacity));
    padding: 0.625rem;
    padding-left: 2.5rem;
    padding-right: 2.5rem;
    --tw-shadow: 0px 0px 30px rgba(0, 0, 0, 0.05);
    --tw-shadow-colored: 0px 0px 30px var(--tw-shadow-color);
    box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
    --tw-backdrop-blur: blur(8px);
    -webkit-backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
    backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
    transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, -webkit-backdrop-filter;
    transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
    transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter, -webkit-backdrop-filter;
    transition-duration: 150ms;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  :is(:where(.dark) .mobile-menu) {
    --tw-bg-opacity: 1;
    background-color: rgb(19 20 16 / var(--tw-bg-opacity));
  }
  
  .mobile-menu.open {
    --tw-translate-x: 0px;
    transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
  }
  
  .mobile-menu .faq-body {
    position: absolute;
    left: 0px;
    top: 3rem;
    z-index: 10;
    width: 100%;
    border-radius: 0.375rem;
    --tw-bg-opacity: 1;
    background-color: rgb(255 255 255 / var(--tw-bg-opacity));
    padding: 1.25rem;
  }
  
  .group:hover .mobile-menu .faq-body {
    --tw-scale-y: 1;
    transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
    opacity: 1;
  }
  
  :is(:where(.dark) .mobile-menu .faq-body) {
    --tw-bg-opacity: 1;
    background-color: rgb(33 34 32 / var(--tw-bg-opacity));
  }
  
  .mobile-menu .faq-body > *:not(:first-child) {
    margin-top: 0.625rem;
  }
  
  .mobile-menu .faq-body > *:not(:last-child) {
    border-bottom-width: 1px;
    border-style: dashed;
    --tw-border-opacity: 1;
    border-color: rgb(237 240 230 / var(--tw-border-opacity));
  }
  
  :is(:where(.dark) .mobile-menu .faq-body > *:not(:last-child)) {
    --tw-border-opacity: 1;
    border-color: rgb(55 57 53 / var(--tw-border-opacity));
  }
`

  return (
    <>
      <style jsx>{mobileMenuStyles}</style>
      <header
        className={`fixed left-0 w-full z-[1000000000] duration-500 transition-all ${
          isScrolled ? "top-0" : "top-[52px]"
        }`}
        id="mainnavigationBar"
      >
        <nav className="container flex relative items-center py-3">
          {/* Logo */}
          <div className="nav-logo">
            <Link href="/" className="flex items-center relative h-10 w-[120px]">
              <Image
                src="/images/logo.svg"
                alt="Viqium AI Logo"
                fill
                className="dark:hidden object-contain transition-all duration-300"
              />
              <Image
                src="/images/logo-light.svg"
                alt="Viqium AI Logo"
                fill
                className="hidden dark:inline-block object-contain transition-all duration-300"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <ul className="nav-list hidden lg:flex lg:ml-7 xl:ml-15 [&>*:not(:last-child)]:me-1">
            {navItems.map((li, i) => (
              <li key={i}>
                <Link
                  href={li.href ?? "/"}
                  className="font-Inter flex items-center text-base font-medium leading-8 text-paragraph dark:text-white py-[5px] px-5 lg:px-4 xl:px-5 border rounded-large border-transparent hover:bg-white/80 hover:border-borderColour dark:hover:bg-dark-200/80 dark:hover:border-borderColour/10 duration-300 hover:duration-300 transition-all backdrop-blur-sm hover:shadow-md"
                >
                  {li.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Right Side Actions */}
          <ul className="flex items-center ml-auto [&>*:not(:last-child)]:me-2.5">
            {status === "loading" ? (
              // Loading state
              <li className="max-lg:hidden">
                <div className="flex items-center gap-3 p-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                  <div className="space-y-2">
                    <div className="w-24 h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    <div className="w-20 h-2 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  </div>
                </div>
              </li>
            ) : session?.user ? (
              // User Profile Dropdown
              <li className="max-lg:hidden">
                <UserDropdown user={session.user} displayName={displayName} initials={initials} />
              </li>
            ) : (
              // Login/Signup Buttons
              <>
                <li className="max-lg:hidden">
                  <Link href="/signin" className="btn btn-navbar btn-sm hover:bg-white transition-all duration-300">
                    Đăng nhập
                  </Link>
                </li>
                <li className="max-lg:hidden">
                  <Link href="/signup" className="btn-navbar btn-outline btn-sm btn-smtransition-all duration-300">
                    Đăng ký
                  </Link>
                </li>
              </>
            )}

            {/* Mobile Menu Button */}
            <li className="max-lg:inline-block lg:hidden">
              <button
                className="outline-none mobile-menu-button w-12 h-12 rounded-full bg-white/90 dark:bg-dark-200/90 relative backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 touch-manipulation active:scale-95 flex items-center justify-center"
                onClick={toggleMobileMenu}
                onTouchStart={(e) => e.preventDefault()}
                aria-label="Toggle mobile menu"
                type="button"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={22}
                  height={14}
                  viewBox="0 0 22 14"
                  fill="none"
                  className="pointer-events-none"
                >
                  <path
                    d="M0 1C0 0.447715 0.447715 0 1 0H21C21.5523 0 22 0.447715 22 1C22 1.55228 21.5523 2 21 2H1C0.447716 2 0 1.55228 0 1Z"
                    className="fill-paragraph dark:fill-white"
                  />
                  <path
                    d="M8 7C8 6.44772 8.44772 6 9 6H21C21.5523 6 22 6.44772 22 7C22 7.55228 21.5523 8 21 8H9C8.44772 8 8 7.55228 8 7Z"
                    className="fill-paragraph dark:fill-white"
                  />
                  <path
                    d="M4 13C4 12.4477 4.44772 12 5 12H21C21.5523 12 22 12.4477 22 13C22 13.5523 21.5523 14 21 14H5C4.44772 14 4 13.5523 4 13Z"
                    className="fill-paragraph dark:fill-white"
                  />
                </svg>
              </button>
            </li>
          </ul>

          {/* Mobile Menu */}
          <div
            className={`mobile-menu max-lg:overflow-y-auto lg:hidden ${isMobileMenuOpen ? "open" : ""}`}
            style={{ touchAction: "manipulation" }}
          >
            <button
              className="outline-none navbar-toggle-close w-12 h-12 rounded-full bg-white dark:bg-black/20 absolute right-6 top-5 shadow-lg touch-manipulation active:scale-95 flex items-center justify-center backdrop-blur-sm"
              onClick={toggleMobileMenu}
              onTouchStart={(e) => e.preventDefault()}
              aria-label="Close mobile menu"
              type="button"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={24}
                height={24}
                viewBox="0 0 24 24"
                fill="none"
                className="pointer-events-none"
              >
                <path
                  d="M18 6L6 18M6 6L18 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="stroke-paragraph dark:stroke-white"
                />
              </svg>
            </button>
            <ul className="nav-list flex flex-col gap-5 w-full max-w-[500px] landscape:h-full relative p-6 pt-20">
              {session?.user ? (
                // Mobile User Profile
                <li className="p-4 bg-gradient-to-r from-white/50 to-gray-50/50 dark:from-dark-300/50 dark:to-dark-200/50 rounded-xl backdrop-blur-sm">
                  <UserDropdown user={session.user} displayName={displayName} initials={initials} />
                </li>
              ) : (
                // Mobile Login/Signup
                <>
                  <li>
                    <Link
                      href="/signin"
                      className="btn btn-navbar  w-full "
                      onClick={toggleMobileMenu}
                    >
                      Đăng nhập
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/signup"
                      className="btn-outline btn-navbar w-full "
                      onClick={toggleMobileMenu}
                    >
                      Đăng ký
                    </Link>
                  </li>
                </>
              )}

              {/* Mobile Navigation Items */}
              {navItems.map((li, i) => (
                <li key={i}>
                  <Link
                    href={li.href }
      className="flex items-center text-base font-medium leading-8 text-paragraph py-3 px-5 border-2 border-transparent rounded-full transition-all duration-200 hover:border-white"
                    onClick={toggleMobileMenu}
                  >
                    {li.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </header>
    </>
  )
}
