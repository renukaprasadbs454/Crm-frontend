import { ArrowLeft } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function BackButton({ fallback = '/' }) {
  const navigate = useNavigate();
  const location = useLocation();

  function goBack() {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }
    navigate(fallback);
  }

  return (
    <button
      type="button"
      onClick={goBack}
      disabled={location.pathname === fallback}
      className="mb-5 inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-600 transition hover:border-brand-300 hover:text-brand-700 disabled:cursor-not-allowed disabled:opacity-40"
      aria-label="Go back"
    >
      <ArrowLeft size={16} /> Back
    </button>
  );
}
