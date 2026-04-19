import { useState } from 'react';
import { toast } from 'react-hot-toast';
import withLoading from '../utils/WithLoading';
import api from '../utils/api.js';

export default function DonateButton({ projectId, amount }: { projectId: string | number, amount: string | number }) {
  const [loading, setLoading] = useState(false);
  const BASE_URL = import.meta.env.VITE_BASE_BACKEND_URL;

  const handleDonate = async () => {
    if (!amount || Number(amount) <= 0) return;
    
    setLoading(true);

    try {
      const response = await withLoading(api.post(`${BASE_URL}/donations/checkout/${projectId}/`, {
        amount: Number(amount)
      }));

      const data = response.data;
      if (data.checkout_url) {
        toast.loading('Redirecting to secure checkout...');
        window.location.href = data.checkout_url;
      } else {
        console.error('Failed to get checkout URL', data);
        toast.error('Unable to initiate donation. Please try again.');
        setLoading(false);
      }
    } catch (error) {
      console.error('Error:', error);
      // withLoading already shows a toast error if it fails
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDonate}
      disabled={loading || !amount || Number(amount) <= 0}
      className={`btn-primary w-full mt-4 py-3 tracking-wide text-sm font-bold uppercase transition-all ${loading || !amount || Number(amount) <= 0 ? 'opacity-50 cursor-not-allowed' : 'opacity-100 hover:shadow-lg'}`}
    >
      {loading ? 'Redirecting to Stripe...' : `Donate ${amount || 0} EGP`}
    </button>
  );
}