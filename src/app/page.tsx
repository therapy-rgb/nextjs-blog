import Image from "next/image";

export default async function Home() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center">
        <Image
          src="/image.png"
          alt="Suburban Dad Mode"
          width={600}
          height={600}
          className="mx-auto rounded-lg shadow-lg"
          priority
        />
        <div className="flex justify-end mt-6 max-w-[600px] mx-auto">
          <p className="text-xl text-sdm-text font-cooper">
            always classic
          </p>
        </div>
      </div>
    </div>
  );
}
