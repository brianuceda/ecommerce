import { clsx } from "clsx";

interface TitleProps {
  children: React.ReactNode;
  as?: "h1" | "h2" | "h3";
  size?: "base" | "lg" | "xl";
  className?: string;
}

export default function Title({
  children,
  as: Component = "h1",
  size = "base",
  className,
}: TitleProps) {
  const finalClassName = clsx(
    "font-montserrat my-2",
    {
      "[font-size:clamp(1.3rem,1.21rem+0.43vw,1.5rem)] font-semibold":
        size === "base",
      "[font-size:clamp(1.5rem,1.25rem+1.25vw,1.875rem)] font-bold":
        size === "lg",
      "[font-size:clamp(1.875rem,1.5rem+1.875vw,2.25rem)] font-bold":
        size === "xl",
    },
    className
  );

  return <Component className={finalClassName}>{children}</Component>;
}
