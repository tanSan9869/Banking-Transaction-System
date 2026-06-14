// import React from "react";

const AccountCard = ({ account, onSelect, isSelected }) => {
  return (
    <div
      className={` bg-linear-to-br from-indigo-600 to-violet-600 text-white rounded-[14px] p-6 cursor-pointer min-w-65 transition-all duration-200 border-[3px] ${isSelected ? "border-amber-400 scale-[1.02]" : "border-transparent"} `}
      onClick={() => onSelect(account)}
    >
      <div className="flex justify-between mb-5 text-[0.85rem] opacity-85">
        <span className="font-bold uppercase"> {account.accountType} </span>
        <span className="font-mono"> {account.accountNumber} </span>
      </div>
      <div className="text-[2rem] font-bold mb-1">
        ₹
        {parseFloat(account.balance).toLocaleString("en-IN", {
          minimumFractionDigits: 2,
        })}
      </div>
      <div className="text-[0.8rem] opacity-75"> Available Balance </div>
    </div>
  );
};

export default AccountCard;
