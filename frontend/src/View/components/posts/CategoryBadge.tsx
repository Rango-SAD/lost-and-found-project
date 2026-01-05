import { cn } from "../../../Infrastructure/Utility/cn";
import type { Category } from "../../../Domain/Types/post.ts";
import { CATEGORY_COLOR, CATEGORY_FA } from "../../../Domain/Types/post.ts";

function hexToRgba(hex: string, a: number) {
    const h = hex.replace("#", "");
    const bigint = parseInt(h.length === 3 ? h.split("").map(x => x + x).join("") : h, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r}, ${g}, ${b}, ${a})`;
}

export function CategoryBadge({
                                  category,
                                  className,
                              }: {
    category: Category;
    className?: string;
}) {
    const c = CATEGORY_COLOR[category];

    return (
        <span
            className={cn(
                "inline-flex items-center rounded-full px-4 py-1 text-[12px] font-semibold",
                "backdrop-blur-xl",
                "ring-1 ring-white/10",
                className
            )}
            style={{
                color: c,
                backgroundColor: hexToRgba(c, 0.12),
                boxShadow: `0 0 22px ${hexToRgba(c, 0.22)}`,
                border: `1px solid ${hexToRgba(c, 0.35)}`,
            }}
        >
      {CATEGORY_FA[category]}
    </span>
    );
}
