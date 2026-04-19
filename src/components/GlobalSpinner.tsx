// components/spinner/GlobalSpinner.jsx
import { useSelector } from 'react-redux';
import { ClipLoader } from 'react-spinners';

const GlobalSpinner = () => {
  const isLoading = useSelector((state) => state.ui.loadingCount > 0);
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <ClipLoader color="#ff5600" size={50} />
    </div>
  );
};

export default GlobalSpinner;
