import { Spinner } from "./spinner";

type PageLoadingProps = {
  message?: string;
};

const PageLoading = ({ message = "Loading page..." }: PageLoadingProps) => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center">
      <Spinner size="xl" variant="primary" />
      <p className="mt-4 text-lg text-gray-600">{message}</p>
    </div>
  );
};

export { PageLoading };
