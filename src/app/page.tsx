import Image from "next/image";
import { Typewriter } from "@/components/ui";

export default async function Home() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="sr-only">Suburban Dad Mode - A Blog About Life in the Suburbs</h1>
      <div className="text-center">
        <Image
          src="/image.webp"
          alt="Suburban Dad Mode"
          width={600}
          height={600}
          className="mx-auto rounded-lg shadow-lg"
          priority
        />
        <div className="flex justify-end mt-6 max-w-[600px] mx-auto">
          <Typewriter text="always classic" className="text-xl text-sdm-text font-cooper" />
        </div>
      </div>
    </div>
  );
}
