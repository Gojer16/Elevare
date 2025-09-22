import { UnifiedLoadingSpinner } from "./UnifiedLoadingSpinner";

const LoadingSpinner = ({ message = "Loading..." }: { message?: string }) => {
  return <UnifiedLoadingSpinner message={message} size="xl" />;
};

export default LoadingSpinner;
