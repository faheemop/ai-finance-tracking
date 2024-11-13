import Link from "next/link";
import React from "react";

function IncomeItem({ budget }) {
  const calculateProgressPerc = () => {
    const perc = (budget.totalSpend / budget.amount) * 100;
    return perc > 100 ? 100 : perc.toFixed(2);
  };

  return (
    <div className="p-5 border rounded-2xl hover:shadow-md cursor-pointer h-[170px]">
      <div className="flex gap-2 items-center justify-between">
        <div className="flex gap-2 items-center">
          <h2 className="text-2xl p-3 px-4 bg-slate-100 rounded-full">
            {budget?.icon}
          </h2>
          <div>
            <h2 className="font-bold">{budget.name}</h2>
            <h2 className="text-sm text-gray-500">{budget.totalItem} Item</h2>
            {/* Display start and end dates */}
            {budget.startDate && budget.endDate ? (
              <div className="text-xs text-gray-400">
                {`From: ${new Date(budget.startDate).toLocaleDateString()} To: ${new Date(budget.endDate).toLocaleDateString()}`}
              </div>
            ) : (
              <div className="text-xs text-gray-400">No date range set</div>
            )}
          </div>
        </div>
        <h2 className="font-bold text-primary text-lg"> ${budget.amount}</h2>
      </div>
    </div>
  );
}

export default IncomeItem;
