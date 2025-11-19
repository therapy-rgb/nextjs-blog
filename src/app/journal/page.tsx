import Link from 'next/link'
import { format } from 'date-fns'
import { client, postsQuery, defaultAuthor } from "@/lib/sanity";
import { Post } from "@/types/sanity";

export const revalidate = 60; // Revalidate every minute

async function getPosts(): Promise<Post[]> {
  try {
    const entries = await client.fetch(postsQuery);
    // Add default author to each journal entry
    return entries.map((entry: any) => ({
      ...entry,
      author: defaultAuthor,
      categories: []
    }));
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
}

export default async function Journal() {
  const posts = await getPosts();

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="mb-16">
        <h1 className="font-display text-5xl font-bold text-sdm-text mb-2">
          Journal
        </h1>
      </div>

      {posts.length > 0 ? (
        <div className="space-y-12">
          {posts.map((post) => (
            <article key={post._id} className="border-b border-warm-gray-200 pb-12 last:border-b-0">
              <Link href={`/posts/${post.slug.current}`}>
                <time
                  dateTime={post.publishedAt}
                  className="font-cooper text-sm text-sdm-text-light block mb-3"
                >
                  {format(new Date(post.publishedAt), 'MMMM d, yyyy')}
                </time>
                <h2 className="font-display text-3xl font-bold text-sdm-text mb-4 hover:text-sdm-primary transition-colors duration-200">
                  {post.title}
                </h2>
                {post.excerpt && (
                  <p className="font-cooper text-lg text-sdm-text-light leading-relaxed">
                    {post.excerpt}
                  </p>
                )}
              </Link>
            </article>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-sdm-text-light font-cooper text-lg">No entries yet.</p>
        </div>
      )}
    </div>
  );
}
