import type { Category } from "../../../Domain/Types/post";
import { CATEGORY_THEME } from "../../../Domain/Types/post";
import { cn } from "../../../Infrastructure/Utility/cn";

export function CategoryBadge({
                                  category,
                                  className,
                              }: {
    category: Category;
    className?: string;
}) {
    const t = CATEGORY_THEME[category];

    return (
        <span
            className={cn(
                "inline-flex items-center rounded-full px-4 py-1 text-[12px] font-semibold",
                "ring-1 ring-white/10",
                t.pillBg,
                t.pillText,
                t.glow,
                className
            )}
        >
      دسته بندی
    </span>
    );
}
