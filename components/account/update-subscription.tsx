import { Switch } from "@/components/ui";
import { useOptimisticUpdate } from "@/lib/hooks/use-optimistic-update";

export function UpdateSubscription() {
  const { data, isLoading, update } = useOptimisticUpdate<{
    subscribed: boolean;
  }>("/api/user/subscribe", {
    loading: "更新订阅配置...",
    success: "订阅配置更新成功！",
    error: "订阅配置更新失败！",
  });

  const subscribe = async (checked: boolean) => {
    const res = await fetch("/api/user/subscribe", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ subscribed: checked }),
    });
    if (!res.ok) {
      throw new Error("订阅配置更新失败！");
    }
    return { subscribed: checked };
  };

  return (
    <div className="flex items-center gap-x-2">
      <Switch
        checked={data?.subscribed}
        loading={isLoading}
        fn={(checked: boolean) => {
          update(() => subscribe(checked), { subscribed: checked });
        }}
      />
      <p className="text-gray-500 text-sm">订阅产品更新</p>
    </div>
  );
}
