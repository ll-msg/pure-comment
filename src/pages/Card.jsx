export default function Card({ step, title, description, icon }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 hover:-translate-y-1 hover:shadow-lg transition">
      
      {icon && (
        <div className="text-2xl mb-3 text-white">
          {icon}
        </div>
      )}

      {step && (
        <div className="text-white/40 text-sm mb-2">
          {step}
        </div>
      )}

      <h3 className="text-xl font-semibold text-white mb-2">
        {title}
      </h3>

      <p className="text-white/60">
        {description}
      </p>

    </div>
  );
}

export function HeaderButton({ description, target }) {
  const handleClick = () => {
    const el = document.getElementById(target);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <button
      onClick={handleClick}
      className="px-3 py-2 rounded-md hover:bg-white/10 transition-colors leading-none hover:text-white"
    >
      {description}
    </button>
  );
}

export function SectionTitle({ title, description }) {
  return(
    <div className="text-center mb-12">
        <h2 className="text-4xl font-semibold text-white font-heading">
            {title}
        </h2>
        <p className="text-white/50 mt-3">
            {description}
        </p>
    </div>
  )
}