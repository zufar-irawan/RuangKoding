"use client";

import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

const Avatar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
      className,
    )}
    {...props}
  />
));
Avatar.displayName = "Avatar";

const AvatarImage = React.forwardRef<
  HTMLImageElement,
  React.ImgHTMLAttributes<HTMLImageElement> & {
    src?: string;
    alt?: string;
  }
>(({ className, src, alt, ...props }, ref) => {
  const [imageStatus, setImageStatus] = React.useState<
    "loading" | "loaded" | "error"
  >("loading");

  // Reset status when src changes
  React.useEffect(() => {
    if (src) {
      setImageStatus("loading");
    } else {
      setImageStatus("error");
    }
  }, [src]);

  if (!src) {
    return null;
  }

  // If image failed to load, return null to show fallback
  if (imageStatus === "error") {
    return null;
  }

  return (
    <Image
      ref={ref as any}
      className={cn(
        "aspect-square h-full w-full object-cover rounded-full",
        imageStatus === "loading" && "opacity-0",
        imageStatus === "loaded" && "opacity-100",
        "transition-opacity duration-200",
        className,
      )}
      src={src}
      alt={alt || ""}
      width={40}
      height={40}
      onLoad={() => setImageStatus("loaded")}
      onError={() => {
        console.error(`Failed to load image: ${src}`);
        setImageStatus("error");
      }}
    />
  );
});
AvatarImage.displayName = "AvatarImage";

const AvatarFallback = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full bg-muted",
      className,
    )}
    {...props}
  />
));
AvatarFallback.displayName = "AvatarFallback";

export { Avatar, AvatarImage, AvatarFallback };
