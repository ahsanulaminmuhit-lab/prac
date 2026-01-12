import { cn } from "@/lib/utils";

type SpinnerProps = {
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "primary" | "secondary" | "light";
  className?: string;
  text?: string;
};

const Spinner = ({
  size = "md",
  variant = "primary",
  className,
  text,
}: SpinnerProps) => {
  const sizeClasses = {
    sm: "h-4 w-4 border-2",
    md: "h-8 w-8 border-3",
    lg: "h-12 w-12 border-4",
    xl: "h-16 w-16 border-4",
  };

  const variantClasses = {
    primary: "border-blue-600 border-t-transparent text-blue-600",
    secondary: "border-gray-600 border-t-transparent text-gray-600",
    light: "border-white border-t-transparent text-white",
  };

  return (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      <div
        className={cn(
          "animate-spin rounded-full border-solid",
          sizeClasses[size],
          variantClasses[variant]
        )}
      />
      {text && (
        <p className={`mt-2 text-sm ${variantClasses[variant]}`}>{text}</p>
      )}
    </div>
  );
};

export { Spinner };
