/* eslint-disable no-unused-vars */
import React from "react";

const TransactionHistory = ({ transactions }) => {
  if (!transactions.length) {
    return (
      <div className="text-center text-gray-400 p-8">
        
        No transactions yet. Make your first deposit!
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-2.5">
      {transactions.map((txn) => {
        const isCredit =
          txn.type === "DEPOSIT" || (txn.type === "TRANSFER" && txn.amount > 0);
        const color =
          txn.type === "DEPOSIT"
            ? "#16a34a"
            : txn.type === "WITHDRAWAL"
              ? "#dc2626"
              : "#4f46e5";
        const sign = txn.type === "DEPOSIT" ? "+" : "-";
        return (
          <div
            key={txn.id}
            className="flex items-center gap-4 p-4 bg-gray-50 rounded-[10px]"
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-[1.2rem] shrink-0"
              style={{ backgroundColor: color + "20", color }}
            >
              {txn.type === "DEPOSIT"
                ? "↓"
                : txn.type === "WITHDRAWAL"
                  ? "↑"
                  : "⇄"}
            </div>
            <div className="flex-1">
              <div className="font-semibold text-[0.9rem]">{txn.type}</div>
              <div className="text-gray-500 text-[0.8rem] mt-0.5">
                
                {txn.description || "No description"}
              </div>
            </div>
            <div className="text-right">
              
              <div className="font-bold text-[1rem]" style={{ color }}>
                
                {sign}₹
                {parseFloat(txn.amount).toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                })}
              </div>
              <div className="text-gray-400 text-[0.75rem] mt-0.5">
                
                Bal: ₹
                {parseFloat(txn.balanceAfter).toLocaleString("en-IN")}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TransactionHistory;
