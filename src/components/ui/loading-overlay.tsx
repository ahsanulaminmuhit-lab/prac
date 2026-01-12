import { Spinner } from "./spinner";

type LoadingOverlayProps = {
  isLoading: boolean;
  text?: string;
  fullScreen?: boolean;
};

const LoadingOverlay = ({
  isLoading,
  text = "Loading...",
  fullScreen = true,
}: LoadingOverlayProps) => {
  if (!isLoading) return null;

  return (
    <div
      className={`flex items-center justify-center bg-black/30 backdrop-blur-sm z-50 ${
        fullScreen ? "fixed inset-0" : "absolute inset-0 rounded-lg"
      }`}
    >
      <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
        <Spinner size="lg" variant="primary" text={text} />
      </div>
    </div>
  );
};

export { LoadingOverlay };
