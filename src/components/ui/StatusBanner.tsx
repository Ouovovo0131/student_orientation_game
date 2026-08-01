import { AlertTriangle, LoaderCircle } from "lucide-react";

interface StatusBannerProps {
  loading: boolean;
  taskMessage: string;
  error: string | null;
}

export function StatusBanner({ loading, taskMessage, error }: StatusBannerProps) {
  if (error) {
    return (
      <div
        className="mt-4 flex items-center gap-2 border-4 border-black bg-[#FF6A6A] p-3 font-bold text-black"
        role="alert"
      >
        <AlertTriangle aria-hidden="true" />
        <span>錯誤：{error}</span>
      </div>
    );
  }

  if (!loading) {
    return null;
  }

  return (
    <div className="mt-4 flex items-center gap-2 border-4 border-black bg-[#8DD8FF] p-3 font-bold text-black">
      <LoaderCircle className="animate-spin" aria-hidden="true" />
      <span>目前任務：{taskMessage}</span>
    </div>
  );
}