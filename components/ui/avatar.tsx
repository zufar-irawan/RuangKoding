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
      className
    )}
    {...props}
  />
));
Avatar.displayName = "Avatar";

const AvatarImage = React.forwardRef<
  HTMLDivElement,
  Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src'> & { src?: string }
>(({ className, src, alt }, ref) => {
  const [imageLoaded, setImageLoaded] = React.useState(false);

  if (!src) return null;

  return (
    <div ref={ref} className="relative h-full w-full">
      <Image
        className={cn(
          "aspect-square h-full w-full object-cover",
          imageLoaded ? "block" : "hidden",
          className
        )}
        src={src}
        alt={alt || ""}
        fill
        sizes="40px"
        onLoad={() => setImageLoaded(true)}
      />
    </div>
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
      className
    )}
    {...props}
  />
));
AvatarFallback.displayName = "AvatarFallback";

export { Avatar, AvatarImage, AvatarFallback };
