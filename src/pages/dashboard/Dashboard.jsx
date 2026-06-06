import StatsCards from "./StatsCards.jsx";
import RenderQueue from "./RenderQueue.jsx";
import CloudStorage from "./CloudStorage.jsx";
import TeamCard from "./TeamCard.jsx";
import QuickActions from "./QuickActions.jsx";
import { RecentProjects, AISuggestions } from "./ProjectsAndSuggestions.jsx";
import TrendingTemplates from "./TrendingTemplates.jsx";

export default function Dashboard() {
  return (
    <div className="min-h-screen p-4 lg:p-6" >

      {/* Heading */}
      <div className="mb-5 lg:mb-6">
        <h1 className="text-white text-2xl lg:text-3xl font-extrabold mb-1">
          Welcome Back, <span style={{ color: "#FD4FDA" }}>Akash</span> 👋
        </h1>
        <p className="text-sm" style={{ color: "#9191A8" }}>
          You have 3 reels processing and 12 photos awaiting client approval.
        </p>
      </div>

      {/* Stats Row */}
      <StatsCards />

      {/* Render Queue + Side Cards */}
      {/* Stacks to single column on mobile/tablet, 2-col on lg+ */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-4 mb-4">
        <RenderQueue />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
          <CloudStorage />
          <TeamCard />
        </div>
      </div>

      {/* Quick Actions */}
      <QuickActions />

      {/* Recent Projects + AI Suggestions */}
      {/* Stacks to single column on mobile/tablet */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-4 mb-4">
        <RecentProjects />
        <AISuggestions />
      </div>

      {/* Trending Templates */}
      <TrendingTemplates />

    </div>
  );
}