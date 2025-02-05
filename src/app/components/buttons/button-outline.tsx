import type { MouseEventHandler } from "react";
import { forwardRef } from "react";

type ButtonOutlineProps = {
  className?: string;
  children: React.ReactNode;
  onClick?: MouseEventHandler;
  disabled?: boolean;
};

export const ButtonOutline = forwardRef<HTMLButtonElement, ButtonOutlineProps>(function FnComponent(
  { className, children, disabled = false, onClick },
  ref,
) {
  return (
    <div className={className}>
      <button
        ref={ref}
        className="block h-[44px] w-full rounded-[12px] border-2 border-solid border-light-blue-500 px-6 py-3 text-xs font-bold text-light-blue-500 transition-all duration-300 hover:bg-light-blue-100"
        onClick={onClick}
        disabled={disabled}
      >
        {children}
      </button>
    </div>
  );
});
