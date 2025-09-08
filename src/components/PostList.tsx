import { Post } from '@/types/sanity'
import PostCard from './PostCard'

interface PostListProps {
  posts: Post[]
}

export default function PostList({ posts }: PostListProps) {
  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-sdm-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-sdm-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <p className="text-sdm-text-light font-cooper text-lg">No posts found.</p>
      </div>
    )
  }

  return (
    <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
      {posts.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}
    </div>
  )
}