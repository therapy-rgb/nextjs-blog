import Image from 'next/image'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { Post } from '@/types/sanity'
import { urlFor } from '@/lib/sanity'

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
              className="object-cover transition-transform duration-200 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-200" />
          </div>
        </Link>
      )}
      
      <div className="p-6">
        <div className="flex items-center gap-2 text-sm text-sdm-text-light mb-4">
          {post.author.image && (
            <div className="relative w-8 h-8 rounded-full overflow-hidden">
              <Image
                src={urlFor(post.author.image).width(32).height(32).url()}
                alt={post.author.name}
                fill
                className="object-cover"
              />
            </div>
          )}
          <span className="font-cooper">{post.author.name}</span>
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
        
        <Link 
          href={`/posts/${post.slug.current}`}
          className="inline-flex items-center gap-2 text-sdm-primary font-cooper font-semibold hover:text-sdm-accent transition-colors duration-200 group"
        >
          Read more
          <svg 
            className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>
    </article>
  )
}