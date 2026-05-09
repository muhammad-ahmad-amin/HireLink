import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import TopNav from "../components/TopNav";

export default function Wallet() {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);

  const [withdrawalAmount, setWithdrawalAmount] = useState("");
  const [bankAccount, setBankAccount] = useState("");
  const [showWithdrawalForm, setShowWithdrawalForm] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/login");
      return;
    }
    setUser(JSON.parse(storedUser));
  }, [navigate]);

  const handleWithdrawal = (e) => {
    e.preventDefault();
    const amount = parseFloat(withdrawalAmount);

    if (!amount || amount <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    if (amount > balance) {
      alert("Insufficient balance");
      return;
    }

    if (!bankAccount.trim()) {
      alert("Please enter a valid bank account");
      return;
    }

    const newTransaction = {
      id: transactions.length + 1,
      type: "withdrawal",
      description: `Withdrawal to Bank Account ${bankAccount}`,
      amount: -amount,
      date: new Date().toISOString().split("T")[0],
      status: "pending",
    };

    setBalance(balance - amount);
    setTransactions([newTransaction, ...transactions]);
    setWithdrawalAmount("");
    setBankAccount("");
    setShowWithdrawalForm(false);
    alert("Withdrawal request submitted! It will be processed within 2-3 business days.");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <TopNav user={user} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex">{/* Main Content */}
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Wallet</h2>

            {/* Balance Card */}
            <div className="bg-[#14a800] text-white p-8 rounded-xl shadow-sm mb-6">
              <p className="text-sm opacity-90 mb-2">Available Balance</p>
              <h1 className="text-5xl font-bold mb-4">${balance.toFixed(2)}</h1>
              <button
                onClick={() => setShowWithdrawalForm(!showWithdrawalForm)}
                className="bg-white text-[#14a800] px-6 py-2 rounded-lg hover:bg-green-50 transition-colors font-semibold"
              >
                {showWithdrawalForm ? "Cancel" : "Withdraw"}
              </button>
            </div>

            {/* Withdrawal Form */}
            {showWithdrawalForm && (
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Withdraw Funds</h3>
                <form onSubmit={handleWithdrawal} className="space-y-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Amount ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={withdrawalAmount}
                      onChange={(e) => setWithdrawalAmount(e.target.value)}
                      placeholder="Enter amount to withdraw"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#14a800]"
                      required
                    />
                    <p className="text-gray-600 text-sm mt-2">Available: ${balance.toFixed(2)}</p>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Bank Account</label>
                    <input
                      type="text"
                      value={bankAccount}
                      onChange={(e) => setBankAccount(e.target.value)}
                      placeholder="Enter your bank account number"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#14a800]"
                      required
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="submit"
                      className="bg-[#14a800] text-white px-6 py-2 rounded-lg hover:bg-[#118f00] transition-colors font-semibold"
                    >
                      Withdraw
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowWithdrawalForm(false)}
                      className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors font-semibold"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Transaction History */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-xl font-bold text-gray-900">Transaction History</h3>
              </div>
              <div className="divide-y divide-gray-200">
                {transactions.length === 0 ? (
                  <div className="p-6 text-center text-gray-600">
                    <p>No transactions yet</p>
                  </div>
                ) : (
                  transactions.map((transaction) => (
                    <div key={transaction.id} className="p-6 flex justify-between items-center hover:bg-gray-50 transition-colors">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{transaction.description}</p>
                        <p className="text-gray-600 text-sm mb-2">{transaction.date}</p>
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          transaction.status === "completed"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}>
                          {transaction.status}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className={`text-2xl font-bold ${
                          transaction.amount > 0 ? "text-[#14a800]" : "text-red-600"
                        }`}>
                          {transaction.amount > 0 ? "+" : ""}{transaction.amount.toFixed(2)}
                        </p>
                        <p className="text-gray-600 text-sm">
                          {transaction.type === "earnings" && "Payment"}
                          {transaction.type === "withdrawal" && "Withdrawal"}
                          {transaction.type === "fee" && "Fee"}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
