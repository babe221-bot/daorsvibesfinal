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
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-white bg-black bg-opacity-50">
        <h1 className="text-4xl font-bold md:text-6xl">DaorsVibes</h1>
        <div className="mt-8">
          <Link href="/login">
            <Button className="flashing-button">Započnimo</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
