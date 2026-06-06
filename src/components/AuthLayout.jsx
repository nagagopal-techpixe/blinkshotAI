import GridBackground from "../components/GridBackground.jsx";
import TopCircle      from "../components/TopCircle.jsx";
import CyanCircle     from "../components/CyanCircle.jsx";

export default function AuthLayout({ children }) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#0D0D14]">

      <GridBackground />

      <TopCircle className="-top-72 -left-52" />

      <CyanCircle className="top-10 left-1/2 -translate-x-1/2" />

      <div className="relative z-10">
        {children}
      </div>

    </div>
  );
}