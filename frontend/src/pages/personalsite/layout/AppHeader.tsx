import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSidebar } from "../context/SidebarContext";
import { ThemeToggleButton } from "../../personalsite/components/common/ThemeToggleButton";
import NotificationDropdown from "../../personalsite/components/header/NotificationDropdown";
import UserDropdown from "../../personalsite/components/header/UserDropdown";
import { AlertIcon, GridIcon, ListIcon, TaskIcon } from "../icons";
import { HomeIcon } from "@heroicons/react/24/outline";

interface AppHeaderProps {
    onToggleSidebarVisibility: () => void;
    isSidebarOpen: boolean;
}

const AppHeader: React.FC<AppHeaderProps> = ({ onToggleSidebarVisibility, isSidebarOpen }) => {
    const [isApplicationMenuOpen, setApplicationMenuOpen] = useState(false);

    const { isMobileOpen, toggleSidebar, toggleMobileSidebar } = useSidebar();
    const location = useLocation();
    const navigate = useNavigate();

    const toggleApplicationMenu = () => {
        setApplicationMenuOpen(!isApplicationMenuOpen);
    };

    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setTimeout(() => {
            if (isSidebarOpen) {
                onToggleSidebarVisibility();
            }
        }, 0);
    }, []);

    return (
        <header
            className="sticky top-0 flex w-full bg-white border-gray-200 z-99999 dark:border-gray-800 dark:bg-gray-900 lg:border-b"
            style={{ zIndex: 10, width: isSidebarOpen ? 'auto' : '100%' }}
        >
            <div className="flex flex-col items-center justify-between flex-grow lg:flex-row lg:px-6">
                <div
                    className="flex items-center justify-between w-full gap-2 px-3 py-3 border-b border-gray-200 dark:border-gray-800 sm:gap-4 lg:justify-normal lg:border-b-0 lg:px-0 lg:py-4"
                >
                    <Link to="/" className="lg:hidden">
                        <img className="dark:hidden" src="./images/logo/logo.svg" alt="Logo"/>
                        <img className="hidden dark:block" src="./images/logo/logo-dark.svg" alt="Logo"/>
                    </Link>

                    {/* Centered Buttons Container */}
                    <div className="hidden lg:flex items-center space-x-4 w-[600px] mx-auto"> {/* Adjust width as needed */}
                        <Link
                            to="/"
                            className="items-center justify-center w-10 h-10 text-gray-500 border-gray-200 rounded-lg dark:border-gray-800 lg:flex dark:text-gray-400 lg:h-11 lg:w-11 lg:border hover:bg-gray-100 dark:hover:bg-gray-800"
                            aria-label="Home"
                        >
                            <span className={`menu-item-icon-size`}>
                                <HomeIcon/>
                            </span>
                        </Link>

                        <Link
                            to="/library"
                            className="items-center justify-center w-10 h-10 text-gray-500 border-gray-200 rounded-lg dark:border-gray-800 lg:flex dark:text-gray-400 lg:h-11 lg:w-11 lg:border hover:bg-gray-100 dark:hover:bg-gray-800"
                            aria-label="Project"
                        >
                            <span className={`menu-item-icon-size`}>
                                <ListIcon/>
                            </span>
                        </Link>

                        <Link
                            to="/analysis"
                            className="items-center justify-center w-10 h-10 text-gray-500 border-gray-200 rounded-lg dark:border-gray-800 lg:flex dark:text-gray-400 lg:h-11 lg:w-11 lg:border hover:bg-gray-100 dark:hover:bg-gray-800"
                            aria-label="Analysis"
                        >
                            <span className={`menu-item-icon-size`}>
                                <TaskIcon/>
                            </span>
                        </Link>

                        <Link
                            to="/logs"
                            className="items-center justify-center w-10 h-10 text-gray-500 border-gray-200 rounded-lg dark:border-gray-800 lg:flex dark:text-gray-400 lg:h-11 lg:w-11 lg:border hover:bg-gray-100 dark:hover:bg-gray-800"
                            aria-label="Logs"
                        >
                            <span className={`menu-item-icon-size`}>
                                <AlertIcon/>
                            </span>
                        </Link>
                    </div>
                </div>
                <div
                    ref={menuRef}
                    className={`${isApplicationMenuOpen ? "flex" : "hidden"
                        } items-center justify-between w-full gap-4 px-5 py-4 lg:flex shadow-theme-md lg:justify-end lg:px-0 lg:shadow-none`}
                >
                    <div className="flex items-center gap-2 2xsm:gap-3">
                        <ThemeToggleButton/>
                        <NotificationDropdown/>
                    </div>
                    <UserDropdown/>
                </div>
            </div>

        </header>
    );
};

export default AppHeader;