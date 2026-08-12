export default function RouteLoading() {
  return <div className="fixed inset-0 z-[90] grid place-items-center overflow-hidden bg-[#080a0d] text-[#f4f5ef]" role="status" aria-label="Opening page">
    <div className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#b7f35b]/[.045] blur-[80px]"/>
    <div className="relative flex flex-col items-center gap-5">
      <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#b7f35b] font-black text-[#0a0d08]">F</div>
      <div className="h-px w-28 overflow-hidden bg-white/10"><div className="route-loading-line h-full w-1/2 bg-[#b7f35b]"/></div>
      <span className="sr-only">Opening Frokes OS</span>
    </div>
  </div>;
}
