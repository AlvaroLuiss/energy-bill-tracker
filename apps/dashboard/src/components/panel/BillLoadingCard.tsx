export const BillLoadingCard = () => (
  <div className="flex items-center p-4 bg-green-50/50 rounded-lg border border-green-100">
    <div className="flex flex-col w-full gap-3">
      <div className="flex flex-col gap-2">
        <div className="h-5 bg-green-100/50 rounded-md w-24 animate-pulse"></div>
        <div className="h-4 bg-green-100/50 rounded-md w-32 animate-pulse"></div>
      </div>
    </div>
  </div>
);