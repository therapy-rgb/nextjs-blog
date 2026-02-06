import Image from 'next/image'
import { urlFor } from '@/lib/sanity'
import { SanityImage } from '@/types/sanity'

interface AuthorAvatarProps {
  name: string
  image?: SanityImage
  size?: number
}

export default function AuthorAvatar({ name, image, size = 32 }: AuthorAvatarProps) {
  if (image) {
    return (
      <div
        className="relative rounded-full overflow-hidden"
        style={{ width: size, height: size }}
      >
        <Image
          src={urlFor(image).width(size).height(size).url()}
          alt={name}
          fill
          sizes={`${size}px`}
          className="object-cover"
        />
      </div>
    )
  }

  return (
    <div
      className="relative rounded-full overflow-hidden bg-sdm-primary/20 flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <span className="text-sdm-primary font-bold text-sm">
        {name?.charAt(0) || 'M'}
      </span>
    </div>
  )
}
