import Image from 'next/image'

export default function Footer() {
  return (
    <footer className="border-t border-warm-gray-200 mt-20 bg-sdm-card">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex justify-center">
        <div aria-hidden="true">
          <Image
            src="/squiggle.webp"
            alt=""
            width={800}
            height={252}
            className="w-64 md:w-80 opacity-85 invert"
          />
        </div>
      </div>
    </footer>
  )
}
