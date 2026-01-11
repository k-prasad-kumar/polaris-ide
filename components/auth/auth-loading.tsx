import { Spinner } from "../ui/spinner";

export const AuthLoadingView = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-background">
      <Spinner className="text-ring size-6" />
    </div>
  );
};
