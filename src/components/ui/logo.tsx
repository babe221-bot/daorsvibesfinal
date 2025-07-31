import Image from "next/image";

const Logo = () => {
  return (
    <div className="flex items-center justify-center">
      <Image
        src="/icons/logo-128x128.png"
        alt="DaorsVibes Logo"
        width={100}
        height={100}
        className="mix-blend-screen"
        priority
      />
    </div>
  );
};

export default Logo;
