import Image from 'next/image'

export default function Footer() {
  return (
    <footer className="mt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-center md:justify-start">
        <div aria-hidden="true">
          <Image
            src="/squiggle.webp"
            alt=""
            width={800}
            height={252}
            className="w-64 md:w-80 opacity-90 [filter:brightness(0)_invert(13%)_sepia(33%)_saturate(2468%)_hue-rotate(190deg)_brightness(92%)_contrast(94%)]"
          />
        </div>
      </div>
    </footer>
  )
}
