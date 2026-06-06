const templates = [
  {
    title: "Cinematic Love",
    duration: "00:30",
    hot: true,
    thumb: "https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?w=400&q=80",
  },
  {
    title: "Cinematic Love",
    duration: "00:30",
    hot: false,
    thumb: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&q=80",
  },
  {
    title: "Cinematic Love",
    duration: "00:30",
    hot: false,
    thumb: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&q=80",
  },
  {
    title: "Cinematic Love",
    duration: "00:30",
    hot: false,
    thumb: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400&q=80",
  },
  {
    title: "Cinematic Love",
    duration: "00:30",
    hot: false,
    thumb: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=400&q=80",
  },
];

export default function TrendingTemplates() {
  return (
    <div className="rounded-2xl p-4 lg:p-5 mb-4" style={{ background: "#060B28", border: "1px solid #222" }}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-white text-base lg:text-lg font-bold">Trending Templates</h2>
        <button className="text-sm font-semibold hover:opacity-80 transition-opacity" style={{ color: "#8D45FE" }}>
          View all
        </button>
      </div>

      {/* 2 cols on mobile, 3 on sm, 5 on lg */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {templates.map(({ title, duration, hot, thumb }, i) => (
          <div
            key={i}
            className="relative rounded-xl overflow-hidden cursor-pointer group"
            style={{ aspectRatio: "9/13" }}
          >
            <img
              src={thumb}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              style={{ display: "block" }}
            />

            {/* dark gradient overlay */}
            <div
              className="absolute inset-0"
              style={{ background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.1) 50%, transparent 100%)" }}
            />

            {/* Hot badge */}
            {hot && (
              <div
                className="absolute top-2 left-2 text-white text-xs font-bold px-2 py-0.5 rounded-md"
                style={{ background: "#EF4444" }}
              >
                Hot
              </div>
            )}

            {/* Title + duration */}
            <div className="absolute bottom-0 left-0 right-0 p-2.5 lg:p-3">
              <p className="text-white text-xs lg:text-sm font-bold leading-tight mb-0.5">{title}</p>
              <p className="text-xs" style={{ color: "rgba(255,255,255,0.7)" }}>{duration}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}