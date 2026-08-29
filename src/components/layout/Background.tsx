export default function Background() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true">
      {/* Subtle gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#FAFAFF] via-[#F5F3FF] to-[#FAFAFF]" />

      {/* Very subtle grid */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'linear-gradient(rgba(109,40,217,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(109,40,217,0.3) 1px, transparent 1px)',
        backgroundSize: '80px 80px',
      }} />

      {/* Subtle purple orbs */}
      <div className="absolute top-[-200px] right-[-100px] w-[600px] h-[600px] rounded-full bg-[#8B5CF6] opacity-[0.03] blur-[120px]" />
      <div className="absolute bottom-[-200px] left-[-100px] w-[500px] h-[500px] rounded-full bg-[#6D28D9] opacity-[0.02] blur-[120px]" />
    </div>
  )
}
