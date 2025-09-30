import React from "react";
import { clsx } from "clsx";

interface ContainerProps {
  children: React.ReactNode;
  type?: "default" | "wide";
  as?: "div" | "section" | "main" | "article";
  className?: string;
}

export default function Container({
  children,
  type = "default",
  as: Component = "div",
  className,
}: ContainerProps) {
  const finalClassName = clsx(
    "mx-auto w-sfull",
    {
      "max-w-screen-2xl px-3 py-6 sm:px-6 sm:py-10 lg:px-8 lg:py-12": type === "default",
    },
    className
  );

  return <Component className={finalClassName}>{children}</Component>;
}
