<<<<<<< HEAD
=======
import { Button } from "@/components/ui/button";
>>>>>>> 393eea469d735144848945653dca895f2deb8842
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
<<<<<<< HEAD
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-white bg-black bg-opacity-50 p-4">
        <h1 className="text-5xl font-bold text-center md:text-7xl bg-gradient-to-r from-primary to-accent text-transparent bg-clip-text" style={{'textShadow': '2px 2px 8px rgba(0,0,0,0.5)'}}>DaorsVibes</h1>
        <p className="mt-4 text-lg text-center md:text-xl text-white/80 max-w-2xl" style={{'textShadow': '1px 1px 4px rgba(0,0,0,0.5)'}}>
          Sve što je muzičaru potrebno: od štimera i metronoma do kalendara s nastupima i biblioteke akorda.
        </p>
        <div className="mt-10">
          <Link href="/login" title="Započnite transformaciju">
            <div className="flashing-button rounded-full p-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="url(#gradient)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-20 h-20 text-white transition-transform duration-300 hover:scale-110 cursor-pointer"
              >
                <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="hsl(var(--primary))" />
                        <stop offset="100%" stopColor="hsl(var(--accent))" />
                    </linearGradient>
                </defs>
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                <line x1="12" y1="19" x2="12" y2="23"></line>
                <line x1="8" y1="23" x2="16" y2="23"></line>
              </svg>
            </div>
=======
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-white bg-black bg-opacity-50">
        <h1 className="text-4xl font-bold md:text-6xl">DaorsVibes</h1>
        <p className="mt-4 text-lg text-center md:text-2xl">
          Transponiranje muzike pomoću vještačke inteligencije
        </p>
        <div className="mt-8">
          <Link href="/login">
            <Button className="flashing-button">Započnimo</Button>
>>>>>>> 393eea469d735144848945653dca895f2deb8842
          </Link>
        </div>
      </div>
    </div>
  );
}
