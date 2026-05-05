export default function LoginPage() {
  return (
    <div className="flex h-screen items-center justify-center bg-black text-emerald-500">
      <div className="border border-emerald-500 p-8 rounded-lg shadow-[0_0_20px_rgba(16,185,129,0.2)] bg-[#0a0a0a]">
        <h1 className="text-2xl mb-6 text-center font-black tracking-widest uppercase">System Access Required</h1>
        <input 
            type="password" 
            placeholder="ENTER ACCESS CODE" 
            className="bg-black border border-emerald-500/50 focus:border-emerald-500 p-3 w-full mb-6 outline-none text-white font-mono rounded" 
        />
        <button 
            className="w-full bg-emerald-500 text-black font-black tracking-widest py-3 rounded hover:bg-emerald-400 transition-colors" 
            onClick={() => window.location.href='/dashboard'}
        >
          AUTHORIZE
        </button>
      </div>
    </div>
  );
}