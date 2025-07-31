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
          <Link href="/login">
            <Button className="flashing-button">zapocnimo sa transformacijom</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
