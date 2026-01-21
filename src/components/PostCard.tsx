import Image from 'next/image'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { Post } from '@/types/sanity'
import { urlFor } from '@/lib/sanity'
import AuthorAvatar from './AuthorAvatar'
import ArrowLink from './ArrowLink'

interface PostCardProps {
  post: Post
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <article className="bg-sdm-card rounded-lg shadow-sm border border-warm-gray-200 overflow-hidden hover:shadow-md transition-all duration-200 hover:-translate-y-1">
      {post.mainImage && (
        <Link href={`/posts/${post.slug.current}`}>
          <div className="relative h-48 sm:h-56 w-full overflow-hidden">
            <Image
              src={urlFor(post.mainImage).width(600).height(300).url()}
              alt={post.mainImage.alt || post.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 600px"
              className="object-cover transition-transform duration-200 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-200" />
          </div>
        </Link>
      )}

      <div className="p-6">
        <div className="flex items-center gap-2 text-sm text-sdm-text-light mb-4">
          <AuthorAvatar
            name={post.author?.name || 'Marcus Berley'}
            image={post.author?.image}
            size={32}
          />
          <span className="font-cooper">{post.author?.name || 'Marcus Berley'}</span>
          <span>•</span>
          <time dateTime={post.publishedAt} className="font-cooper">
            {formatDistanceToNow(new Date(post.publishedAt), { addSuffix: true })}
          </time>
        </div>

        <h2 className="font-display text-xl sm:text-2xl font-bold text-sdm-text mb-3 leading-tight">
          <Link
            href={`/posts/${post.slug.current}`}
            className="hover:text-sdm-primary transition-colors duration-200"
          >
            {post.title}
          </Link>
        </h2>

        {post.excerpt && (
          <p className="text-sdm-text-light font-cooper leading-relaxed mb-6">
            {post.excerpt}
          </p>
        )}

        <ArrowLink href={`/posts/${post.slug.current}`}>
          Read more
        </ArrowLink>
      </div>
    </article>
  )
}