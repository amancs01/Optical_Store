import { getCurrentStepIndex, orderTimelineSteps } from "@/lib/orderStatus";

export function OrderStatusTimeline({ orderStatus }: { orderStatus: string }) {
  if (orderStatus === "cancelled") {
    return (
      <div className="mt-6 rounded-md border border-rose-200 bg-rose-50 p-4 text-sm font-bold text-rose-800">
        This order has been cancelled.
      </div>
    );
  }

  const currentIndex = getCurrentStepIndex(orderStatus);

  return (
    <div className="mt-6 grid gap-3 sm:grid-cols-5">
      {orderTimelineSteps.map((step, index) => {
        const isCompleted = currentIndex > index;
        const isCurrent = currentIndex === index;
        const stateClass = isCurrent
          ? "border-teal-700 bg-teal-700 text-white shadow-md"
          : isCompleted
            ? "border-teal-300 bg-teal-50 text-teal-900"
            : "border-slate-200 bg-slate-50 text-slate-500";

        return (
          <div key={step.status} className={`rounded-md border p-4 ${stateClass}`}>
            <div className="flex items-center gap-2">
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-black ${
                  isCurrent
                    ? "bg-white text-teal-700"
                    : isCompleted
                      ? "bg-teal-700 text-white"
                      : "bg-slate-200 text-slate-500"
                }`}
              >
                {index + 1}
              </span>
              <p className="text-sm font-black">{step.label}</p>
            </div>
            <p className="mt-2 text-xs font-semibold">
              {isCurrent ? "Current step" : isCompleted ? "Completed" : "Upcoming"}
            </p>
          </div>
        );
      })}
    </div>
  );
}
