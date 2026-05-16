import Image, { ImageProps } from "next/image";
import { cn } from "@/lib/utils";

type SkeletonImageProps = ImageProps & {
  containerClassName?: string;
  shimmer?: boolean;
};

export function SkeletonImage({
  containerClassName,
  shimmer = true,
  className,
  alt,
  ...props
}: SkeletonImageProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden",
        shimmer && "img-shimmer",
        containerClassName
      )}
    >
      <Image
        {...props}
        alt={alt}
        className={cn("img-reveal", className)}
      />
    </div>
  );
}
