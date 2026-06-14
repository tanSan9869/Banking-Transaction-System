// import React from 'react'

import { useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";

const TransactionModal = ({ account, onClose, onSuccess }) => {
  const [tab, setTab] = useState("deposit");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [toAccount, setToAccount] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
      e.preventDefault();
      if(!amount || isNaN(amount) || parseFloat(amount)<=0){
        toast.error("Enter a valid amount");    
        return;
      }

      setLoading(true);
      try {
        const base = `/accounts/${account.id}/transactions`;

        if(tab === "deposit"){
            await api.post(`$(base)/deposit`,{
                amount: parseFloat(amount),
                description
            });
            toast.success(`₹${amount} deposited!`);
        }else if(tab === "withdraw"){
            await api.post(`${base}/withdraw`,{
                amount: parseFloat(amount),
                description
            });
            toast.success(`₹${amount} withdrawn!`);
        }else{
            if(!toAccount){
                toast.error("Enter Destination Account");
                return;
            }

            await api.post(`${base}/transfer`,{
                toAccountNumber: toAccount,
                amount: parseFloat(amount),
                description
            });
            toast.success(`₹${amount} transferred to ${toAccount}`);
        }
        onSuccess();
        onClose();
      } catch (err) {
        toast.error(err.response?.data || 'Transaction Failed');
      }finally{
          setLoading(false);
      }
  }
  
  const tabs = ["deposit", "withdraw", "transfer"];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-1000">
      <div className="bg-white rounded-[14px] w-full max-w-110 p-6 shadow-[0_8px_32px_rgba(0,0,0,0.15)]">
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-lg font-semibold"> New Transaction </h3>
          <button
            className="bg-transparent border-none text-[1.2rem] cursor-pointer text-gray-500"
            onClick={onClose}
          >
            
            ✕
          </button>
          </div>
          {/* Tab Switcher */}
          <div className="flex gap-2 mb-5">
            
            {tabs.map((t) => (
              <button
                key={t}
                className={`flex-1 p-2 border rounded-lg cursor-pointer transition ${tab === t ? "bg-indigo-600 text-white border-indigo-600" : "bg-white border-gray-300"}`}
                onClick={() => setTab(t)}
              >
                
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
          {/* Form */}
          <div className="flex flex-col gap-3">
            
            {tab === "transfer" && (
              <div className="flex flex-col gap-1">
                
                <label>To Account Number</label>
                <input
                  className="px-[0.9rem] py-[0.65rem] border border-gray-300 rounded-lg text-[0.95rem] outline-none"
                  placeholder="ACC-000123"
                  value={toAccount}
                  onChange={(e) => setToAccount(e.target.value)}
                />
              </div>
            )}
            <div className="flex flex-col gap-1">
              
              <label>Amount (₹)</label>
              <input
                className="px-[0.9rem] py-[0.65rem] border border-gray-300 rounded-lg text-[0.95rem] outline-none"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1">
              
              <label>Description (optional)</label>
              <input
                className="px-[0.9rem] py-[0.65rem] border border-gray-300 rounded-lg text-[0.95rem] outline-none"
                placeholder="e.g. Salary, Rent..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <button
              className={`mt-2 py-3 text-white rounded-lg text-base cursor-pointer transition disabled:opacity-70 ${tab === "deposit" ? "bg-green-600 hover:bg-green-700" : tab === "withdraw" ? "bg-red-600 hover:bg-red-700" : "bg-indigo-600 hover:bg-indigo-700"}`}
              onClick={handleSubmit}
              disabled={loading}
            >
              
              {loading
                ? "Processing..."
                : `Confirm ${tab.charAt(0).toUpperCase() + tab.slice(1)}`}
            </button>
          
        </div>
      </div>
    </div>
  );
};

export default TransactionModal;
