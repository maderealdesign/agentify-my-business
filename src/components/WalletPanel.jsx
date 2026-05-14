import React, { useState, useEffect } from 'react';
import { Wallet, Lock, Sparkles } from 'lucide-react';
import { updateWalletBalance, getUserWallet } from '../firebase';
import { auth } from '../firebase';

function WalletPanel() {
  const [balance, setBalance] = useState(0.00);
  const [loading, setLoading] = useState(true);
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState('10');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    loadWalletBalance();
  }, []);

  async function loadWalletBalance() {
    try {
      setLoading(true);
      const user = auth.currentUser;
      
      if (user) {
        const walletData = await getUserWallet(user.uid);
        setBalance(walletData.walletBalance || 0.00);
      } else {
        // Try anonymous sign-in first
        const { signInWithAnonymous } = await import('../firebase');
        const userCredential = await signInWithAnonymous();
        const walletData = await getUserWallet(userCredential.user.uid);
        setBalance(walletData.walletBalance || 0.00);
      }
    } catch (error) {
      console.error('Error loading wallet:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleTopUp() {
    try {
      setProcessing(true);
      
      const amount = parseFloat(topUpAmount);
      if (amount <= 0 || isNaN(amount)) {
        alert('Please enter a valid amount');
        return;
      }

      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Apply your margin (you keep MARGIN_PERCENTAGE %)
      const marginAmount = amount * 0.15; // You keep 15%
      const openRouterCredit = amount - marginAmount; // Rest goes to OpenRouter
      
      console.log(`Processing top-up: £${amount}`);
      console.log(`Your margin: £${marginAmount.toFixed(2)}`);
      console.log(`OpenRouter credit: $${openRouterCredit.toFixed(2)}`);

      // Update wallet balance in Firebase
      await updateWalletBalance(auth.currentUser.uid, openRouterCredit, 'credit');
      
      setBalance(prev => prev + openRouterCredit);
      setShowTopUpModal(false);
      
      alert(`Successfully added £${amount}! You now have $${(balance + openRouterCredit).toFixed(2)} credit.`);
    } catch (error) {
      console.error('Top-up error:', error);
      alert('Error processing top-up. Please try again.');
    } finally {
      setProcessing(false);
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-lg p-6">
      {/* Wallet Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
            <Wallet className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <h3 className="font-bold text-stone-800">Your Wallet</h3>
            <p className="text-xs text-stone-500">Top up to use agents</p>
          </div>
        </div>
        
        {loading ? (
          <div className="w-24 h-8 bg-stone-100 rounded animate-pulse"></div>
        ) : (
          <div className="text-right">
            <div className="text-2xl font-bold text-emerald-600">
              ${balance.toFixed(2)}
            </div>
            <button 
              onClick={() => setShowTopUpModal(true)}
              className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
            >
              + Top up
            </button>
          </div>
        )}
      </div>

      {/* Usage Info */}
      <div className="bg-stone-50 rounded-lg p-4 border border-stone-100">
        <div className="flex items-start gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-amber-500 mt-0.5" />
          <p className="text-xs text-stone-600">
            Your credit is used for AI model calls via OpenRouter. 
            You keep a small margin on each top-up to cover platform costs.
          </p>
        </div>
      </div>

      {/* Top-Up Modal */}
      {showTopUpModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-xl">
            <h3 className="text-lg font-bold text-stone-800 mb-4">Add Credit to Wallet</h3>
            
            <div className="space-y-4">
              <label className="block">
                <span className="text-sm font-medium text-stone-700">Amount (£)</span>
                <input
                  type="number"
                  value={topUpAmount}
                  onChange={(e) => setTopUpAmount(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Enter amount"
                  min="5"
                  max="100"
                />
              </label>

              <div className="bg-stone-50 rounded-lg p-3 text-xs">
                <p className="font-medium text-stone-700 mb-1">Breakdown:</p>
                <ul className="space-y-1 text-stone-600">
                  <li>You pay: £{topUpAmount}</li>
                  <li>Your margin (15%): £{(parseFloat(topUpAmount) * 0.15).toFixed(2)}</li>
                  <li>OpenRouter credit: ${(parseFloat(topUpAmount) - parseFloat(topUpAmount) * 0.15).toFixed(2)}</li>
                </ul>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowTopUpModal(false)}
                  disabled={processing}
                  className="flex-1 px-4 py-2 border border-stone-300 rounded-lg text-stone-700 hover:bg-stone-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleTopUp}
                  disabled={processing}
                  className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {processing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      Add Credit
                    </>
                  )}
                </button>
              </div>

              <p className="text-xs text-stone-500 text-center">
                🔒 Secure payment via Stripe (integration placeholder)
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default WalletPanel;
