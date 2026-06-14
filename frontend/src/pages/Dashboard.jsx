/* eslint-disable no-unused-vars */
import React, { useCallback, useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import AccountCard from "../components/AccountCard";
import TransactionHistory from "../components/TransactionHistory";
import api from "../api/axios";
import toast from "react-hot-toast";

const Dashboard = () => {
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [accountType, setAccountType] = useState('SAVINGS');
  const [loading, setLoading] = useState(true);

  const fetchAccounts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/accounts");
      setAccounts(res.data);
      if (res.data.length > 0 && !selectedAccount) {
        setSelectedAccount(res.data[0]);
      }
    } catch (err) {
      toast.error("Failed to load accounts");
    } finally {
      setLoading(false);
    }
  }, [selectedAccount]);

  const fetchTransactions = useCallback(async () => {
    if (!selectedAccount) return;
    try {
      const res = await api.get(
        `/accounts/${selectedAccount.id}/transactions`,
      );
      setTransactions(res.data);
    } catch (err) {
      toast.error("Failed to load transactions");
    }
  }, [selectedAccount]);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleCreateAccount = async () => {
    try {
      await api.post(`/accounts?type=${accountType}`);
      toast.success(`${accountType} Account Created!`);
      setShowCreateForm(false);
      fetchAccounts();
    } catch (err) {
      toast.error(err.response?.data || "Failed to create account");
    }
  };

  const handleTransactionSuccess = () => {
    fetchAccounts();
    fetchTransactions();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading your accounts...</p>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-[#f0f4ff]">
      <Navbar />
      <div className="max-w-225 mx-auto px-4 py-8">
        {/* Accounts Section */}
        <div className="bg-white rounded-[14px] p-6 mb-6 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-[1.1rem] font-semibold text-indigo-950">
              
              My Accounts
            </h2>
            <button
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-indigo-700 transition"
              onClick={() => setShowCreateForm(!showCreateForm)}
            >
              
              + New Account
            </button>
          </div>
          {/* Create Account Form */}
          {showCreateForm && (
            <div className="flex gap-3 items-center mb-4 p-4 bg-[#f5f5ff] rounded-[10px]">
              
              <select
                className="px-3 py-2 border border-gray-300 rounded-lg text-[0.9rem]"
                value={accountType}
                onChange={(e) => setAccountType(e.target.value)}
              >
                
                <option value="SAVINGS">Savings Account</option>
                <option value="CURRENT">Current Account</option>
              </select>
              <button
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-indigo-700 transition"
                onClick={handleCreateAccount}
              >
                
                Create
              </button>
              <button
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-300 transition"
                onClick={() => setShowCreateForm(false)}
              >
                
                Cancel
              </button>
            </div>
          )}
          {/* Account Cards */}
          {accounts.length === 0 ? (
            <p className="text-gray-400 text-center p-4">
              
              No accounts yet. Create one to get started!
            </p>
          ) : (
            <div className="flex gap-4 flex-wrap">
              
              {accounts.map((acc) => (
                <AccountCard
                  key={acc.id}
                  account={acc}
                  isSelected={selectedAccount?.id === acc.id}
                  onSelect={(acc) => {
                    setSelectedAccount(acc);
                    setTransactions([]);
                  }}
                />
              ))}
            </div>
          )}
        </div>
        {/* Transaction Panel */}
        {selectedAccount && (
          <div className="bg-white rounded-[14px] p-6 mb-6 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
            
            <div className="flex justify-between items-center mb-5">
              
              <h2 className="text-[1.1rem] font-semibold text-indigo-950">
                
                Transactions —
                <span className="font-mono text-indigo-600 ml-2 text-[0.9rem]">
                  
                  {selectedAccount.accountNumber}
                </span>
              </h2>
              <button
                className="bg-green-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-green-700 transition"
                onClick={() => setShowModal(true)}
              >
                
                + New Transaction
              </button>
            </div>
            <TransactionHistory transactions={transactions} />
          </div>
        )}
      </div>
      {/* Transaction Modal */}
      {showModal && (
        <TransactionModal
          account={selectedAccount}
          onClose={() => setShowModal(false)}
          onSuccess={handleTransactionSuccess}
        />
      )}
    </div>
  );
};

export default Dashboard;
