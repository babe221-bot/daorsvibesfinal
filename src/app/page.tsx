import { Button } from "@/components/ui/button";
import Link from "next/link";
import "./flashing-button.css";

export default function Page() {
  return (
    <div className="relative h-screen w-screen overflow-hidden">
      <video
        autoPlay
        loop
        muted
        className="absolute top-1/2 left-1/2 w-full h-full object-cover -translate-x-1/2 -translate-y-1/2"
        style={{ objectPosition: "center 20%" }}
      >
        <source src="/logo-transformation-video.mp4" type="video/mp4" />
      </video>
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-white bg-black bg-opacity-50 p-4">
        <h1 className="text-5xl font-bold text-center md:text-7xl bg-gradient-to-r from-primary to-purple-500 text-transparent bg-clip-text" style={{'textShadow': '2px 2px 8px rgba(0,0,0,0.5)'}}>DaorsVibes</h1>
        <p className="mt-4 text-lg text-center md:text-xl text-white/90 max-w-2xl">
          Sve što je muzičaru potrebno: od štimera i metronoma do kalendara s nastupima i biblioteke akorda.
        </p>
        <div className="mt-10">
          <Link href="/login" title="Započnite transformaciju">
            <div className="flashing-button rounded-full p-2">
                 <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-20 h-20 text-white transition-transform duration-300 hover:scale-110 cursor-pointer"
              >
                <path d="M19.143 8.357c-2.365-5.02-10.45-4.52-10.45 1.053 0 3.86 5.39 3.86 5.39-1.895 0-3.328-1.432-3.328-3.328s1.497-3.328 3.328-3.328c1.83 0 3.328 1.497 3.328 3.328v9.428c0 2.21-1.79 4-4 4s-4-1.79-4-4 1.79-4 4-4h.5" />
                <circle cx="12.5" cy="17.5" r="1.5" />
              </svg>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
