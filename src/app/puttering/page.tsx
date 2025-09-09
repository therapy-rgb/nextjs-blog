import Image from "next/image";

export default function Puttering() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center">
        <h1 className="font-display text-4xl sm:text-5xl font-bold text-sdm-text mb-8">
          Puttering
        </h1>
        
        <div className="mb-8">
          <Image
            src="/quick-sheets.png"
            alt="Quick Sheets"
            width={600}
            height={450}
            className="mx-auto rounded-lg shadow-lg"
            priority
            quality={95}
          />
        </div>
      </div>
    </div>
  );
}