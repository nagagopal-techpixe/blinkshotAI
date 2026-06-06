import { useState } from "react";

const categories = [
  "All",
  "Viral Reels",
  "Cinematic",
  "Wedding",
  "Products",
  "Influencer",
  "Travel",
  "Event",
];

const templates = [
  {
    title: "Viral Hook 2.4s",
    category: "Viral Reels",
    badge: "Hot",
    badgeColor: "#EF4444",
    img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80",
    duration: "00:30",
  },
  {
    title: "Cinematic Wedding",
    category: "Wedding",
    badge: "AI Pick",
    badgeColor: "#8D45FE",
    img: "https://images.unsplash.com/photo-1519741497674-611481863552?w=400&q=80",
    duration: "00:30",
  },
  {
    title: "Product Spotlight",
    category: "Products",
    badge: "Top",
    badgeColor: "#059669",
    img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80",
    duration: "00:30",
  },
  {
    title: "Travel Story Vlog",
    category: "Travel",
    badge: "New",
    badgeColor: "#2563EB",
    img: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400&q=80",
    duration: "00:30",
  },
  {
    title: "Product Spotlight",
    category: "Products",
    badge: "Top",
    badgeColor: "#059669",
    img: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=400&q=80",
    duration: "00:30",
  },
  {
    title: "Travel Story Vlog",
    category: "Travel",
    badge: "New",
    badgeColor: "#2563EB",
    img: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=400&q=80",
    duration: "00:30",
  },
  {
    title: "Viral Hook 2.4s",
    category: "Viral Reels",
    badge: "Hot",
    badgeColor: "#EF4444",
    img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80",
    duration: "00:30",
  },
  {
    title: "Cinematic Wedding",
    category: "Wedding",
    badge: "AI Pick",
    badgeColor: "#8D45FE",
    img: "https://images.unsplash.com/photo-1519741497674-611481863552?w=400&q=80",
    duration: "00:30",
  },
];

export default function Templates() {
  const [active, setActive] = useState("All");

  const filtered =
    active === "All"
      ? templates
      : templates.filter((t) => t.category === active);

  return (
    <div
      className="w-full min-h-screen px-3 py-4 sm:p-6"
    
    >
      {/* Header */}
      <div className="flex flex-col gap-4 mb-6">
        <div>
          <h1 className="text-white text-xl sm:text-2xl lg:text-3xl font-extrabold mb-1">
            Template Library
          </h1>

          <p
            className="text-sm sm:text-base"
            style={{ color: "#9191A8" }}
          >
            Battle-tested formats. AI-personalized to your brand.
          </p>
        </div>

        <button
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-white text-sm font-bold hover:opacity-90 transition-opacity"
          style={{
            background: "linear-gradient(90deg, #8D45FE, #FD4FDA)",
          }}
        >
          <svg
            width="16"
            height="16"
            fill="none"
            stroke="white"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>

          New Project
        </button>
      </div>

      {/* Category Pills */}
      <div className="flex gap-2 overflow-x-auto whitespace-nowrap pb-4 mb-6 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className="flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all"
            style={
              active === cat
                ? {
                    background:
                      "linear-gradient(90deg, #8D45FE, #FD4FDA)",
                    color: "#fff",
                  }
                : {
                    background: "#060B28",
                    border: "1px solid #222",
                    color: "#9191A8",
                  }
            }
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((t, i) => (
          <div
            key={i}
            className="rounded-xl overflow-hidden border border-[#222] bg-[#060B28] cursor-pointer group transition-all duration-300 hover:scale-[1.02]"
          >
            {/* Thumbnail */}
            <div className="relative overflow-hidden h-52 sm:h-64 md:h-72 lg:h-80">
              <img
                src={t.img}
                alt={t.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-black/20" />

              {/* Badge */}
              <span
                className="absolute top-3 left-3 text-xs font-bold px-3 py-1 rounded-full text-white"
                style={{ background: t.badgeColor }}
              >
                {t.badge}
              </span>

              {/* Duration */}
              <span className="absolute bottom-3 right-3 bg-black/60 text-white text-xs font-semibold px-2 py-1 rounded-md">
                {t.duration}
              </span>

              {/* Play Button */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{
                    background: "rgba(141,69,254,0.85)",
                    backdropFilter: "blur(4px)",
                  }}
                >
                  <svg
                    width="18"
                    height="18"
                    fill="white"
                    viewBox="0 0 24 24"
                  >
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="p-4">
              <h3 className="text-white text-sm sm:text-base font-bold truncate">
                {t.title}
              </h3>

              <p
                className="text-xs sm:text-sm mt-1"
                style={{ color: "#9191A8" }}
              >
                {t.category}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}