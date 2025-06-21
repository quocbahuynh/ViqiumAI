'use client';

import type React from 'react';
import { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSidebar } from '../context/SidebarContext';
import { ChevronDownIcon, HorizontaLDots, } from '../icons/index';
import { Database, MessageCircle, ArrowLeft, AlertCircle, Link as Link1Icon, ShoppingCart, TicketPercent, Package, ChartPie, Store, Code2, MessageSquareHeart, CircleAlert } from 'lucide-react';
import Image from 'next/image';
import { apiLinks } from '@/lib/api-link';
import { truncateText } from '@/utils/truncate';
import { Modal } from '@/components/ui/modal';
import Button from '@/components/ui/button/Button';
import { useSession } from 'next-auth/react';
import axiosInstance from '@/lib/axios-config';

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

const navItems: NavItem[] = [
  {
    icon: <ChartPie className="w-6 h-6" />,
    name: 'Thống kê tin nhắn',
    path: '/statistic',
  },
  {
    icon: (
      <Store className="w-6 h-6" />

    ),
    name: 'Trang cửa hàng',
    path: '/information',
  },
  {
    icon: (
      <Package className="w-6 h-6" />

    ),
    name: 'Sản phẩm',
    path: '/products',
  },

  {
    icon: <TicketPercent className="w-6 h-6" />,
    name: 'Khuyến mãi',
    subItems: [
      { name: 'Tạo khuyến mãi', path: '/marketing', pro: false },
      { name: 'Chiến dịch', path: '/campaign', pro: false },
    ],
  },
  {
    icon: <ShoppingCart className="w-6 h-6" />,
    name: 'Đơn hàng',
    path: '/orders',
  },
  {
    icon: <Code2 className="w-6 h-6" />,
    name: 'Tích hợp Website',
    path: '/website-integration',
  },
];

const othersItems: NavItem[] = [
  {
    icon: <MessageCircle className="w-6 h-6" />,
    name: 'Huấn luyện AI',
    path: '/chat',
  },
  {
    icon: <Database className="w-6 h-6" />,
    name: 'Bộ nhớ AI',
    path: '/memory',
  },
];

const communityItems: NavItem[] = [
  {
    icon: <MessageSquareHeart className="w-6 h-6" />,
    name: 'Đóng góp',
    path: '/feedback',
  },
];

interface AppSidebarCustomProps {
  projectId: string;
}

interface FanpageMetaCardProps {
  fanpageName: string;
  accessToken: string;
  avatarUrl: string;
  projectId: string;
  fanpageId: string;
  tokenJwt: string;
  closeModal: () => void;
  setFanpageName: (data: string | null) => void;
}

const FanpageMetaCard: React.FC<FanpageMetaCardProps> = ({
  fanpageId,
  fanpageName,
  accessToken,
  avatarUrl,
  projectId,
  tokenJwt,
  closeModal,
  setFanpageName,
}) => {
  const [isConnecting, setConnecting] = useState<boolean>(false);

  const connectFanpage = async () => {
    setConnecting(true);
    try {
      const data = { fanpageId, fanpageName, accessToken, avatarUrl };
      await axiosInstance.post(`${apiLinks.project.pagesList}/${projectId}/connect-fanpage`, data,);
      setFanpageName(fanpageName);
      setConnecting(false);
      closeModal();
    } catch (error) {
      console.error(error);
      setConnecting(false);
    }
  };

  return (
    <div className="p-4 sm:p-5 border border-brand-100 dark:border-gray-700 rounded-xl hover:border-brand-300 dark:hover:border-gray-600 transition-all ">
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 items-center justify-between">
        <div className="flex flex-col sm:flex-row items-center w-2/3 gap-3 sm:gap-4">
          <div className="w-12 h-12 sm:w-14 sm:h-14 overflow-hidden border-2 border-brand-100 dark:border-gray-700 rounded-full relative flex-shrink-0">
            <Image fill className="object-cover" src={avatarUrl || '/placeholder.svg'} alt={fanpageName} />
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h4 className="mb-1 text-base sm:text-lg font-semibold text-gray-800 dark:text-white/90 line-clamp-1">
              {fanpageName}
            </h4>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Facebook Fanpage</p>
          </div>
        </div>
        <Button
          size="sm"
          onClick={connectFanpage}
          disabled={isConnecting}
        >
          {isConnecting ? (
            <span className="flex items-center">
              <svg
                className="animate-spin -ml-1 mr-2 h-3 w-3 sm:h-4 sm:w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span className="text-xs sm:text-sm">Đang kết nối...</span>
            </span>
          ) : (
            <span className="text-xs sm:text-sm">Kết nối</span>
          )}
        </Button>
      </div>
    </div>
  );
};

const AppSidebarCustom: React.FC<AppSidebarCustomProps> = ({ projectId }) => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered, toggleMobileSidebar } = useSidebar();
  const { data: session } = useSession();
  const pathname = usePathname();
  const token = session?.user.token?.accessToken;
  const [fanpageList, setFanpageList] = useState<any[]>([]);
  const [fanpageConnected, setFanpageConnected] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isBreakFanpageModal, setBreakFanpageModal] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  useEffect(() => {
    const fetchPageInfo = async () => {
      try {
        const res = await axiosInstance.get(`${apiLinks.project.pagesInfo}/${projectId}/fanpage`);
        if (res.data.data !== null) {
          setFanpageConnected(res.data.data.name);
        }
      } catch (error) {
        console.error(error);
      }
    };

    if (token) {
      fetchPageInfo();
    }
  }, [projectId, token]);

  const handleFacebookLogin = () => {
    if (!window.FB) return console.error('Facebook SDK not loaded');

    window.FB.login(
      (response: any) => {
        if (response.authResponse) {
          const accessToken = response.authResponse.accessToken;
          fetchPages(accessToken);
        }
      },
      {
        scope: 'public_profile,email,pages_messaging,pages_show_list,pages_manage_metadata,business_management',
      },
    );
  };

  const fetchPages = async (accessToken: string) => {
    try {
      const res = await axiosInstance.post(
        `${apiLinks.project.pagesList}/pages-list`,
        { accessToken }
      );
      const pageList = res.data.data;
      setFanpageList(pageList);
      openModal();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDisconnectFB = async () => {
    try {
      await axiosInstance.post(
        `${apiLinks.project.disconnectPage}/${projectId}/disconnect-fanpage`,


      );
      setFanpageConnected(null);
      setBreakFanpageModal(false);
    } catch (error) {
      console.error(error);
    }
  };

  const renderMenuItems = (navItems: NavItem[], menuType: 'main' | 'others' | 'logout') => (
    <ul className="flex flex-col gap-2">
      {navItems.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index, menuType)}
              className={`menu-item group ${openSubmenu?.type === menuType && openSubmenu?.index === index
                ? 'menu-item-active'
                : 'menu-item-inactive'
                } cursor-pointer ${!isExpanded && !isHovered ? 'justify-center  ' : 'justify-start'} py-2.5`}
            >
              <span
                className={`${openSubmenu?.type === menuType && openSubmenu?.index === index
                  ? 'menu-item-icon-active'
                  : 'menu-item-icon-inactive'
                  }`}
              >
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className="menu-item-text truncate max-w-[180px]">{nav.name}</span>
              )}
              {(isExpanded || isHovered || isMobileOpen) && (
                <ChevronDownIcon
                  className={`ml-auto w-5 h-5 transition-transform duration-200 ${openSubmenu?.type === menuType && openSubmenu?.index === index ? 'rotate-180 text-brand-500' : ''
                    }`}
                />
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                href={menuType === 'logout' ? nav.path : `/manage/${projectId}${nav.path}`}
                className={`menu-item group ${isActive(nav.path) ? 'menu-item-active' : 'menu-item-inactive'
                  } py-2.5`}
                onClick={() => {
                  if (window.innerWidth < 1024 && isMobileOpen) {
                    toggleMobileSidebar();
                  }
                }}
              >
                <span className={`${isActive(nav.path) ? 'menu-item-icon-active' : 'menu-item-icon-inactive'}`}>
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="menu-item-text truncate max-w-[180px]">{nav.name}</span>
                )}
              </Link>
            )
          )}
          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[`${menuType}-${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height:
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? `${subMenuHeight[`${menuType}-${index}`]}px`
                    : '0px',
              }}
            >
              <ul className="mt-2 space-y-1 ml-9">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <Link
                      href={`/manage/${projectId}${subItem.path}`}
                      className={`menu-dropdown-item py-2 ${isActive(subItem.path) ? 'menu-dropdown-item-active' : 'menu-dropdown-item-inactive'
                        }`}
                      onClick={() => {
                        if (window.innerWidth < 1024 && isMobileOpen) {
                          toggleMobileSidebar();
                        }
                      }}
                    >
                      <span className="truncate max-w-[180px]">{subItem.name}</span>
                      <span className="flex items-center gap-1 ml-auto">
                        {subItem.new && (
                          <span
                            className={`ml-auto ${isActive(subItem.path) ? 'menu-dropdown-badge-active' : 'menu-dropdown-badge-inactive'
                              } menu-dropdown-badge text-xs px-1 py-0.5`}
                          >
                            new
                          </span>
                        )}
                        {subItem.pro && (
                          <span
                            className={`ml-auto ${isActive(subItem.path) ? 'menu-dropdown-badge-active' : 'menu-dropdown-badge-inactive'
                              } menu-dropdown-badge text-xs px-1 py-0.5`}
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
        </li>
      ))}
    </ul>
  );

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: 'main' | 'others' | 'logout';
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>({});
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const isActive = useCallback(
    (path: string) => {
      return pathname.includes(`/manage/${projectId}${path}`);
    },
    [pathname, projectId],
  );

  useEffect(() => {
    let submenuMatched = false;
    ['main', 'others'].forEach((menuType) => {
      const items = menuType === 'main' ? navItems : othersItems;
      items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({
                type: menuType as 'main' | 'others',
                index,
              });
              submenuMatched = true;
            }
          });
        }
      });
    });

    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [pathname, isActive]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number, menuType: 'main' | 'others' | 'logout') => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (prevOpenSubmenu && prevOpenSubmenu.type === menuType && prevOpenSubmenu.index === index) {
        return null;
      }
      return { type: menuType, index };
    });
  };

  return (
    <>
      {/* Backdrop for mobile */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-10 lg:hidden"
          onClick={toggleMobileSidebar}
          aria-hidden="true"
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0  h-screen z-50 flex flex-col bg-white backdrop-blur-2xl dark:bg-gray-900 dark:border-gray-800 text-gray-900 border-r border-gray-200 transition-all duration-300 ease-in-out
          ${isExpanded ? 'lg:w-[280px]' : isHovered ? 'lg:w-[280px]' : 'lg:w-[80px]'}
          ${isMobileOpen ? 'left-0 w-[280px] shadow-lg' : '-left-[280px] lg:left-0 w-[280px]'}`}
        onMouseEnter={() => !isExpanded && setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          className={`py-4 px-5 flex items-center ${!isExpanded && !isHovered ? 'justify-center' : 'justify-center'
            } border-b border-gray-100 dark:border-gray-800`}
        >
          <div onClick={() => { window.location.href = `/dashboard` }} className="flex items-center pt-3">
            <div className="nav-logo">
              {(!isExpanded && !isHovered && !isMobileOpen) ? (
                <Image src="/logo.png" alt="icon logo" width={24} height={24} className="w-6 h-6" />
              ) : (
                <>
                  <Image src="/images/logo.svg" alt="logo" width={120} height={40} className="dark:hidden w-auto h-8" />
                  <Image src="/images/logo-light.svg" alt="logo dark version" width={120} height={40} className="hidden dark:inline-block w-auto h-8" />
                </>
              )}
            </div>
          </div>
        </div>
        <div className="px-2 pt-4 pb-2">
          <Link
            href="/dashboard"
            className={`flex items-center gap-1 text-gray-400 hover:text-brand-500 dark:text-gray-300 dark:hover:text-brand-400 transition-colors py-2 px-3 rounded-lg ${!isExpanded && !isHovered ? 'justify-center' : 'justify-start'
              }`}
          >
            {(isExpanded || isHovered || isMobileOpen) && (
              <>
                <ArrowLeft className="w-3 h-3" />
                <span className="text-xs">Quay lại dự án AI</span>
              </>
            )}
          </Link>
        </div>
        <div className="flex flex-col flex-1 overflow-y-auto px-5 pb-4 duration-300 ease-linear no-scrollbar">
          <nav className="mb-6 flex flex-col h-full ">
            <div className="flex flex-col gap-4 flex-1">

              {(isExpanded || isHovered || isMobileOpen) && (
                <div className="mx-auto mt-3 mb-3 w-full max-w-60 rounded-2xl bg-brand-50 dark:bg-brand-500/10 px-3 py-3 text-center shadow-none dark:border-gray-700">
                  <div className="flex flex-col items-center gap-3">
                    {fanpageConnected ? (
                      <>
                        <div className="w-5 h-5 sm:w-7 sm:h-7 rounded-full bg-brand-100 dark:bg-brand-900/20 flex items-center justify-center mb-1">
                          <svg
                            className="w-5 h-5 sm:w-6 sm:h-6 text-brand-500 dark:text-brand-400"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            width="10"
                            height="10"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              fillRule="evenodd"
                              d="M13.135 6H15V3h-1.865a4.147 4.147 0 0 0-4.142 4.142V9H7v3h2v9.938h3V12h2.021l.592-3H12V6.591A.6.6 0 0 1 12.592 6h.543Z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <div className="text-xs sm:text-sm font-medium text-gray-800 dark:text-white mb-1 line-clamp-1">
                          {truncateText(fanpageConnected, 18)}
                        </div>
                        <Button
                          onClick={() => setBreakFanpageModal(true)}
                          variant="outline"
                          size="sm"
                          startIcon={<Link1Icon className="w-3 h-3 sm:w-4 sm:h-4" />}
                        >
                          Hủy kết nối
                        </Button>
                      </>
                    ) : (
                      <>
                        <div className="w-5 h-5 sm:w-7 sm:h-7 rounded-full bg-brand-100 dark:bg-brand-900/20 flex items-center justify-center mb-1">
                          <svg
                            className="w-5 h-5 sm:w-6 sm:h-6 text-brand-500 dark:text-brand-400"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              fillRule="evenodd"
                              d="M13.135 6H15V3h-1.865a4.147 4.147 0 0 0-4.142 4.142V9H7v3h2v9.938h3V12h2.021l.592-3H12V6.591A.6.6 0 0 1 12.592 6h.543Z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <div className="text-xs sm:text-sm font-medium text-gray-800 dark:text-white">
                          Kết nối với Facebook
                        </div>
                        <Button
                          onClick={handleFacebookLogin}
                          variant="primary"
                          size="sm"
                          startIcon={
                            <svg
                              className="w-3 h-3 sm:w-4 sm:h-4 text-white"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                fillRule="evenodd"
                                d="M13.135 6H15V3h-1.865a4.147 4.147 0 0 0-4.142 4.142V9H7v3h2v9.938h3V12h2.021l.592-3H12V6.591A.6.6 0 0 1 12.592 6h.543Z"
                                clipRule="evenodd"
                              />
                            </svg>
                          }
                        >
                          Kết nối Fanpage
                        </Button>
                      </>
                    )}
                    <Link href={`/manage/${projectId}/feedback`} className='flex justify-center items-center text-gray-500 gap-1'>
                      <CircleAlert className="w-4 h-4" />
                      <p className='text-xs'>Đóng góp ý kiến</p>
                    </Link>
                  </div>
                </div>
              )}
              {!isExpanded && !isHovered && !isMobileOpen && (
                <div className="mx-auto mb-10 w-full px-1 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <button
                      onClick={fanpageConnected ? () => setBreakFanpageModal(true) : handleFacebookLogin}
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${fanpageConnected
                        ? 'bg-brand-100 hover:bg-brand-200 dark:bg-brand-900/20 dark:hover:bg-brand-900/30'
                        : 'bg-brand-500 hover:bg-brand-600 dark:bg-brand-600 dark:hover:bg-brand-700'
                        }`}
                      title={fanpageConnected ? `Đã kết nối: ${fanpageConnected}` : 'Kết nối Fanpage Facebook'}
                    >
                      <svg
                        className={`w-5 h-5 ${fanpageConnected ? 'text-brand-500 dark:text-brand-400' : 'text-white'}`}
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fillRule="evenodd"
                          d="M13.135 6H15V3h-1.865a4.147 4.147 0 0 0-4.142 4.142V9H7v3h2v9.938h3V12h2.021l.592-3H12V6.591A.6.6 0 0 1 12.592 6h.543Z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                    {fanpageConnected && <div className="w-2 h-2 rounded-full bg-brand-500 dark:bg-brand-400"></div>}
                  </div>
                </div>
              )}

              <div>
                <h2
                  className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded && !isHovered ? 'justify-center' : 'justify-start'
                    }`}
                >
                  {isExpanded || isHovered || isMobileOpen ? 'CỬA HÀNG' : <HorizontaLDots className="w-5 h-5" />}
                </h2>
                {renderMenuItems(navItems, 'main')}
              </div>

              <div>
                <h2
                  className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded && !isHovered ? 'justify-center' : 'justify-start'
                    }`}
                >
                  {isExpanded || isHovered || isMobileOpen ? 'HUẤN LUYỆN AI' : <HorizontaLDots className="w-5 h-5" />}
                </h2>
                {renderMenuItems(othersItems, 'others')}
              </div>

              <div>
                <h2
                  className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded && !isHovered ? 'justify-center' : 'justify-start'
                    }`}
                >
                  {isExpanded || isHovered || isMobileOpen ? 'HỖ TRỢ' : <HorizontaLDots className="w-5 h-5" />}
                </h2>
                {renderMenuItems(communityItems, 'others')}
              </div>
            </div>

            <div className='py-6'>
            </div>

          </nav>
        </div>
      </aside>

      {/* Modal for selecting Fanpage */}
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
              tokenJwt={token || ''}
              setFanpageName={setFanpageConnected}
            />
          ))}
        </div>
      </Modal>

      {/* Modal for disconnecting Fanpage */}
      <Modal
        isOpen={isBreakFanpageModal}
        onClose={() => setBreakFanpageModal(false)}
        className="max-w-[600px] p-6 sm:p-8 lg:p-10 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl"
      >
        <div className="flex items-center gap-3 mb-6">
          <AlertCircle className="h-6 w-6 text-red-500 dark:text-red-400" />
          <h4 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
            Xác nhận hủy liên kết Fanpage
          </h4>
        </div>

        <div className="mb-8 p-4 sm:p-5 bg-error-50 dark:bg-error-900/20 rounded-xl border border-red-200 dark:border-red-800/30">
          <p className="text-sm sm:text-base text-red-500 dark:text-red-300 leading-relaxed">
            <span className="font-semibold">Cảnh báo:</span> Hủy liên kết với Fanpage này sẽ chấm dứt hoàn toàn khả năng nhận và trả lời tin nhắn từ Fanpage. Dữ liệu liên quan đến cuộc trò chuyện có thể không được lưu trữ. Hành động này <span className="font-semibold">không thể hoàn tác</span>. Bạn có chắc chắn muốn tiếp tục?
          </p>
        </div>

        <div className="flex items-center justify-end gap-4">
          <Button
            size="md"
            variant="outline"
            onClick={() => setBreakFanpageModal(false)}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            Hủy
          </Button>
          <Button
            size="md"
            className="px-4 py-2 text-sm font-medium bg-red-500 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-300 text-white transition-colors"
            onClick={handleDisconnectFB}
          >
            Xác nhận hủy
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default AppSidebarCustom;