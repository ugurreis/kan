import Link from "next/link";
import { twMerge } from "tailwind-merge";

import type { KeyboardShortcut } from "~/providers/keyboard-shortcuts";
import { useIsMobile } from "~/hooks/useMediaQuery";
import { useKeyboardShortcut } from "~/providers/keyboard-shortcuts";

const Button: React.FC<{
  href: string;
  current: boolean;
  name: string;
  icon: React.ReactNode;
  isCollapsed?: boolean;
  onCloseSideNav?: () => void;
  keyboardShortcut: KeyboardShortcut;
}> = ({
  href,
  current,
  name,
  icon,
  isCollapsed = false,
  keyboardShortcut,
  onCloseSideNav,
}) => {
  const isMobile = useIsMobile();
  const { keys: shortcutKeys } = useKeyboardShortcut(keyboardShortcut);

  const handleClick = () => {
    if (onCloseSideNav && isMobile) {
      onCloseSideNav();
    }
  };

  return (
    <Link
      href={href}
      onClick={handleClick}
      className={twMerge(
        "group flex h-[34px] items-center rounded-md p-1.5 text-sm font-normal leading-6 hover:bg-light-200 hover:text-light-1000 dark:hover:bg-dark-200 dark:hover:text-dark-1000",
        isCollapsed ? "md:justify-center" : "justify-between",
        current
          ? "bg-light-200 text-light-1000 dark:bg-dark-200 dark:text-dark-1000"
          : "text-neutral-600 dark:bg-dark-100 dark:text-dark-900",
      )}
      title={isCollapsed ? name : undefined}
    >
      <div
        className={twMerge(
          "flex items-center",
          isCollapsed
            ? "justify-start gap-x-3 md:justify-center md:gap-x-0"
            : "gap-x-3",
        )}
      >
        {/* Statik ikon (animasyon kaldırıldı) */}
        <span className="flex h-[18px] w-[18px] shrink-0 items-center justify-center">
          {icon}
        </span>
        <span className={twMerge(isCollapsed && "md:hidden")}>{name}</span>
      </div>
      {!isCollapsed && (
        <div className="hidden md:group-hover:inline-flex">{shortcutKeys}</div>
      )}
    </Link>
  );
};

export default Button;
