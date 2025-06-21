"use client"

import FanpageConnection from "./sidebar/FanpageConnection"
import FanpageMetaCard from "./sidebar/FanpageMetaCard"
import Logo from "./sidebar/Logo"
import SidebarNavItem from "./sidebar/SidebarNavItem"
import SidebarSection from "./sidebar/SidebarSection"
import Button from "@/components/ui/button/Button"
import { Modal } from "@/components/ui/modal"
import { useSidebar } from "@/context/SidebarContext"
import { useModal } from "@/hooks/useModal"
import { apiLinks } from "@/lib/api-link"
import axios from "axios"
import { usePathname } from "next/navigation"
import type React from "react"
import { useCallback, useEffect, useRef, useState } from "react"
import { useSession } from "next-auth/react"
import Label from "@/components/form/Label"
import Input from "@/components/form/input/InputField"
import Link from "next/link"
import axiosInstance from "@/lib/axios-config"

declare global {
  interface Window {
    FB: any
  }
}

type NavItem = {
  name: string
  icon: React.ReactNode
  description?: string
  path?: string
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[]
}

const navItems: NavItem[] = [
  {
    icon: (
      <svg
        className="w-6 h-6 text-gray-600 dark:text-white"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.4"
          d="M6 4h12M6 4v16M6 4H5m13 0v16m0-16h1m-1 16H6m12 0h1M6 20H5M9 7h1v1H9V7Zm5 0h1v1h-1V7Zm-5 4h1v1H9v-1Zm5 0h1v1h-1v-1Zm-3 4h2a1 1 0 0 1 1 1v4h-4v-4a1 1 0 0 1 1-1Z"
        />
      </svg>
    ),
    name: "Thông tin doanh nghiệp",
    description: "(Giới thiệu doanh nghiệp cho AI)",
    path: "/information",
  },
  {
    icon: (
      <svg
        className="w-6 h-6 text-gray-800 dark:text-white"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M9 8h10M9 12h10M9 16h10M4.99 8H5m-.02 4h.01m0 4H5" />
      </svg>
    ),
    name: "Sản phẩm",
    description: "(Giới thiệu doanh nghiệp cho AI)",
    path: "/products",
  },
  {
    icon: (
      <svg
        className="w-6 h-6 text-gray-600 dark:text-white"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.4"
          d="M8.891 15.107 15.11 8.89m-5.183-.52h.01m3.089 7.254h.01M14.08 3.902a2.849 2.849 0 0 0 2.176.902 2.845 2.845 0 0 1 2.94 2.94 2.849 2.849 0 0 0 .901 2.176 2.847 2.847 0 0 1 0 4.16 2.848 2.848 0 0 0-.901 2.175 2.843 2.843 0 0 1-2.94 2.94 2.848 2.848 0 0 0-2.176.902 2.847 2.847 0 0 1-4.16 0 2.85 2.85 0 0 0-2.176-.902 2.845 2.845 0 0 1-2.94-2.94 2.848 2.848 0 0 0-.901-2.176 2.848 2.848 0 0 1 0-4.16 2.849 2.849 0 0 0 .901-2.176 2.845 2.845 0 0 1 2.941-2.94 2.849 2.849 0 0 0 2.176-.901 2.847 2.847 0 0 1 4.159 0Z"
        />
      </svg>
    ),
    name: "Khuyến mãi",
    description: "(Giới thiệu doanh nghiệp cho AI)",
    path: "/marketing",
    subItems: [{ name: "Form Elements", path: "/form-elements", pro: false }],
  },
]

const othersItems: NavItem[] = [
  {
    icon: (
      <svg
        className="w-6 h-6 text-gray-600 dark:text-white"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.4"
          d="M8 17.345a4.76 4.76 0 0 0 2.558 1.618c2.274.589 4.512-.446 4.999-2.31.487-1.866-1.273-3.9-3.546-4.49-2.273-.59-4.034-2.623-3.547-4.488.486-1.865 2.724-2.899 4.998-2.31.982.236 1.87.793 2.538 1.592m-3.879 12.171V21m0-18v2.2"
        />
      </svg>
    ),
    name: "Kỹ năng chốt sale",
    description: "(Giới thiệu doanh nghiệp cho AI)",
    path: "/calendar",
  },
  {
    icon: (
      <svg
        className="w-6 h-6 text-gray-600 dark:text-white"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.4"
          d="M4 4.5V19a1 1 0 0 0 1 1h15M7 14l4-4 4 4 5-5m0 0h-3.207M20 9v3.207"
        />
      </svg>
    ),
    name: "Kỹ năng upsell",
    description: "(Giới thiệu doanh nghiệp cho AI)",
    path: "/calendar",
  },
  {
    icon: (
      <svg
        className="w-6 h-6 text-gray-600 dark:text-white"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.4"
          d="M4 4h1.5L8 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm.75-3H7.5M11 7H6.312M17 4v6m-3-3h6"
        />
      </svg>
    ),
    name: "Kỹ năng cross-sell",
    description: "(Giới thiệu doanh nghiệp cho AI)",
    path: "/calendar",
  },
  {
    icon: (
      <svg
        className="w-6 h-6 text-gray-600 dark:text-white"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path fill="currentColor" d="M12 17a2 2 0 0 1 2 2h-4a2 2 0 0 1 2-2Z" />
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.4"
          d="M13.815 9H16.5a2 2 0 1 0-1.03-3.707A1.87 1.87 0 0 0 15.5 5 1.992 1.992 0 0 0 12 3.69 1.992 1.992 0 0 0 8.5 5c.002.098.012.196.03.293A2 2 0 1 0 7.5 9h3.388m2.927-.985v3.604M10.228 9v2.574M15 16h.01M9 16h.01m11.962-4.426a1.805 1.805 0 0 1-1.74 1.326 1.893 1.893 0 0 1-1.811-1.326 1.9 1.9 0 0 1-3.621 0 1.8 1.8 0 0 1-1.749 1.326 1.98 1.98 0 0 1-1.87-1.326A1.763 1.763 0 0 1 8.46 12.9a2.035 2.035 0 0 1-1.905-1.326A1.9 1.9 0 0 1 4.74 12.9 1.805 1.805 0 0 1 3 11.574V12a9 9 0 0 0 18 0l-.028-.426Z"
        />
      </svg>
    ),
    name: "Kỹ năng giao tiếp",
    description: "(Giới thiệu doanh nghiệp cho AI)",
    path: "/calendar",
  },
]

const ManagementSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered } = useSidebar()
  const { isOpen, openModal, closeModal } = useModal()
  const [isBreakFanpageModal, setBreakFanpageModal] = useState(false)
  const pathname = usePathname()
  const projectId = pathname.split("/")[2]
  const { data: session } = useSession()
  const token = session?.user.token?.accessToken
  const [fanpageList, setFanpageList] = useState<any[]>([])
  const [fanpageConnected, setFanpageConnected] = useState<string | null>(null)
  const [fanpageNameBreak, setFanpageNameBreak] = useState<string>("")
  const [confirmBreak, setConfirmBreak] = useState<boolean>(true)

  const handleRedirect = (path: string) => {
    return "/manage/" + projectId + path
  }

  useEffect(() => {
    const fetchPageInfo = async () => {
      try {
        const res = await axiosInstance.get(`${apiLinks.project.pagesInfo}/${projectId}/fanpage`)
        if (res.data.data !== null) {
          setFanpageConnected(res.data.data.name)
        }
      } catch (error) {
        console.error(error)
      }
    }

    if (token) {
      fetchPageInfo()
    }
  }, [projectId, token])

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "others"
    index: number
  } | null>(null)
  
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>({})
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({})

  const isActive = useCallback((path: string) => `/manage/${projectId}${path}` === pathname, [pathname, projectId])

  useEffect(() => {
    // Check if the current path matches any submenu item
    let submenuMatched = false
    ;["main", "others"].forEach((menuType) => {
      const items = menuType === "main" ? navItems : othersItems
      items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({
                type: menuType as "main" | "others",
                index,
              })
              submenuMatched = true
            }
          })
        }
      })
    })

    // If no submenu item matches, close the open submenu
    if (!submenuMatched) {
      setOpenSubmenu(null)
    }
  }, [pathname, isActive])

  useEffect(() => {
    // Set the height of the submenu items when the submenu is opened
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }))
      }
    }
  }, [openSubmenu])

  const handleSubmenuToggle = (index: number, menuType: "main" | "others") => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (prevOpenSubmenu && prevOpenSubmenu.type === menuType && prevOpenSubmenu.index === index) {
        return null
      }
      return { type: menuType, index }
    })
  }

  const handleDisconnecFB = async () => {
    if (fanpageNameBreak !== "Đồng ý") {
      setConfirmBreak(false)
      return
    }

    try {
      await axiosInstance.post(
        `${apiLinks.project.disconnectPage}/${projectId}/disconnect-fanpage`,
        
      )

      setFanpageConnected(null)
      setBreakFanpageModal(false)
    } catch (error) {
      console.error(error)
    }
  }

  const handleOpenConnectModal = (pageList: any[]) => {
    setFanpageList(pageList)
    openModal()
  }

  const renderMenuItems = (navItems: NavItem[], menuType: "main" | "others") => (
    <ul className="flex flex-col gap-3">
      {navItems.map((nav, index) => (
        <li key={nav.name} data-popover-target="popover-default">
          {nav.subItems ? (
            <>
              <SidebarNavItem
                name={nav.name}
                icon={nav.icon}
                isActive={openSubmenu?.type === menuType && openSubmenu?.index === index}
                hasSubmenu={true}
                isSubmenuOpen={openSubmenu?.type === menuType && openSubmenu?.index === index}
                onClick={() => handleSubmenuToggle(index, menuType)}
              />
              {(isExpanded || isHovered || isMobileOpen) && (
                <div
                  ref={(el) => {
                    subMenuRefs.current[`${menuType}-${index}`] = el
                  }}
                  className="overflow-hidden transition-all duration-300"
                  style={{
                    height:
                      openSubmenu?.type === menuType && openSubmenu?.index === index
                        ? `${subMenuHeight[`${menuType}-${index}`]}px`
                        : "0px",
                  }}
                >
                  <ul className="mt-2 space-y-1 ml-9">
                    {nav.subItems.map((subItem) => (
                      <li key={subItem.name}>
                        <Link
                          href={subItem.path}
                          className={`menu-dropdown-item ${
                            isActive(subItem.path) ? "menu-dropdown-item-active" : "menu-dropdown-item-inactive"
                          }`}
                        >
                          {subItem.name}
                          <span className="flex items-center gap-1 ml-auto">
                            {subItem.new && (
                              <span
                                className={`ml-auto ${
                                  isActive(subItem.path)
                                    ? "menu-dropdown-badge-active"
                                    : "menu-dropdown-badge-inactive"
                                } menu-dropdown-badge `}
                              >
                                new
                              </span>
                            )}
                            {subItem.pro && (
                              <span
                                className={`ml-auto ${
                                  isActive(subItem.path)
                                    ? "menu-dropdown-badge-active"
                                    : "menu-dropdown-badge-inactive"
                                } menu-dropdown-badge `}
                              >
                                pro
                              </span>
                            )}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          ) : (
            nav.path && (
              <SidebarNavItem
                name={nav.name}
                icon={nav.icon}
                path={handleRedirect(nav.path)}
                isActive={isActive(nav.path)}
              />
            )
          )}
        </li>
      ))}
    </ul>
  )

  return (
    <>
      <aside
        className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${isExpanded || isMobileOpen ? "w-[290px]" : isHovered ? "w-[290px]" : "w-[90px]"}
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      >
        <Logo />
        <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
          <nav className="mb-6">
            <div className="flex flex-col gap-4">
              <SidebarSection title="Thêm dữ liệu cho AI">{renderMenuItems(navItems, "main")}</SidebarSection>
              <SidebarSection title="Huấn luyện cho AI">{renderMenuItems(othersItems, "others")}</SidebarSection>
            </div>
          </nav>
          <FanpageConnection
            projectId={projectId}
            token={token}
            fanpageConnected={fanpageConnected}
            onOpenBreakModal={() => setBreakFanpageModal(true)}
            onOpenConnectModal={handleOpenConnectModal}
          />
        </div>
      </aside>
      <Modal isOpen={isOpen} onClose={closeModal} className="fixed inset-0 z-1000 p-5 lg:p-10 max-w-[700px] max-h-[90vh] overflow-y-auto">
        <h4 className="font-semibold text-gray-800 mb-7 text-title-sm dark:text-white/90">Kết nối Fanpage Facebook</h4>
        <div className="flex flex-col gap-3">
          {fanpageList.map((f) => (
            <FanpageMetaCard
              key={f.id}
              fanpageName={f.name}
              accessToken={f.access_token}
              avatarUrl={f.picture.data.url}
              closeModal={closeModal}
              fanpageId={f.id}
              projectId={projectId}
              tokenJwt={token || ""}
              setFanpageName={setFanpageConnected}
            />
          ))}
        </div>
      </Modal>
      <Modal
        isOpen={isBreakFanpageModal}
        onClose={() => setBreakFanpageModal(false)}
        className="max-w-[584px] p-5 lg:p-10"
      >
        <form className="">
          <h4 className="mb-6 text-lg font-medium text-gray-800 dark:text-white/90">Hủy liên kết Facebook Fanpage</h4>

          <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-1">
            <div className="col-span-1">
              <Label>
                Vui lòng nhập <strong>Đồng ý</strong> để xác nhận hủy liên kết!
              </Label>
              <Input
                type="text"
                placeholder={"Đồng ý"}
                onChange={(e) => setFanpageNameBreak(e.target.value)}
                error={!confirmBreak}
                hint={!confirmBreak ? "Bạn nhập không trùng với tên Fanpage" : ""}
              />
            </div>
          </div>

          <div className="flex items-center justify-end w-full gap-3 mt-6">
            <Button size="sm" variant="outline" onClick={() => setBreakFanpageModal(false)}>
              Thoát
            </Button>
            <Button size="sm" onClick={handleDisconnecFB}>
              Xác nhận
            </Button>
          </div>
        </form>
      </Modal>
    </>
  )
}

export default ManagementSidebar
