import { useNavigate } from "react-router-dom";

export default function StudentsPage() {
  const navigate = useNavigate();
  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate('/dashboard')}
          className="bg-white border border-black/20 rounded-[10px] shadow-[2px_2px_3px_0px_rgba(0,0,0,0.15)] px-4 py-2 transition-all duration-200 ease-in-out hover:shadow-[3px_3px_4px_0px_rgba(0,0,0,0.2)] hover:scale-105 focus:outline-none focus:ring-1 focus:ring-black focus:ring-offset-1 min-w-[90px]"
        >
          <span className="text-[16px] font-semibold text-black leading-[1em] font-comfortaa whitespace-nowrap">Back</span>
        </button>
        <h1 className="text-2xl font-semibold">Students</h1>
      </div>
      <p className="text-muted-foreground">Students listing coming soon.</p>
    </div>
  );
}


