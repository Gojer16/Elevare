import { useTheme } from "@/contexts/ThemeContext";

const LoadingSpinner = ({ message = "Loading..." }: { message?: string }) => {
  const { theme } = useTheme();
  
  // Theme-based classes
  const containerClasses = {
    modern: "flex flex-col items-center justify-center ",
    minimal: "flex flex-col items-center justify-center p-6",
  };

  const spinnerClasses = {
    modern: "animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-BrandPrimary",
    minimal: "animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-BrandPrimary",
  };

  return (
    <div className={containerClasses[theme]}>
      <div className={spinnerClasses[theme]}></div>
      {message && <p className="mt-6 text-lg">{message}</p>}
    </div>
  );
};

export default LoadingSpinner;
