import type { HTMLAttributes } from "react";
import { cn } from "../../../Infrastructure/Utility/cn";

type Props = HTMLAttributes<HTMLDivElement> & {
    edgeClassName?: string;
};

export function GlassSurface({ className, edgeClassName, ...props }: Props) {
    return (
        <div
            {...props}
            className={cn(
                "relative overflow-hidden",
                "bg-white/5 backdrop-blur-2xl",
                "ring-1 ring-white/10",
                className
            )}
        >
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
                <div className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-white/8 blur-3xl" />
            </div>

            <div
                className={cn(
                    "pointer-events-none absolute inset-0 rounded-[inherit]",
                    edgeClassName
                )}
            />

            <div className="relative">{props.children}</div>
        </div>
    );
}
