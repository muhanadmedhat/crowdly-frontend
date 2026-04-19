import { useNavigate } from 'react-router';
import withLoading from '../utils/WithLoading';
import api from '../utils/api.js';
type CreatorToolKitProps = {
  percentage: number;
  isExpired: boolean;
  id: number;
};
const BASE_URL = import.meta.env.VITE_BASE_BACKEND_URL;
function CreatorToolKit({ percentage, isExpired, id }: CreatorToolKitProps) {
  const navigate = useNavigate();
  const handleDelete = async () => {
    await withLoading(api.delete(`${BASE_URL}/projects/${id}/`));
    navigate('/');
  };
  return (
    <div className="card p-4 mt-4">
      <div className="flex items-center gap-2 mb-4">
        <span>🛠️</span>
        <span className="label-md text-[var(--color-on-background)]">Creator Toolkit</span>
      </div>

      <button
        disabled
        className={`w-full py-2 rounded-lg label-md ${isExpired ? 'bg-red-100 text-red-700 font-bold' : 'bg-green-100 text-green-700 font-bold'} cursor-not-allowed`}
      >
        {isExpired ? 'CAMPAIGN ENDED' : 'CAMPAIGN ACTIVE'}
      </button>

      {percentage < 25 && !isExpired && (
        <button
          onClick={() => handleDelete()}
          className="w-full py-2 rounded-lg border border-red-500 text-red-500 label-md mt-3 hover:bg-red-50 transition-colors"
        >
          CANCEL CAMPAIGN
        </button>
      )}

      {percentage < 25 && !isExpired ? (
        <p className="label-md text-[var(--color-text-secondary)] text-center mt-3">
          Cancellation available till campaign is 25% funded. This action is irreversible.
        </p>
      ) : (
        <p className="label-md text-[var(--color-text-secondary)] text-center mt-3">
          Cancellation is locked.
        </p>
      )}
    </div>
  );
}

export default CreatorToolKit;
