import { client, postsQuery } from "@/lib/sanity";
import { Post } from "@/types/sanity";
import PostList from "@/components/PostList";
import Image from "next/image";

export const revalidate = 60; // Revalidate every minute

async function getPosts(): Promise<Post[]> {
  try {
    return await client.fetch(postsQuery);
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
}

export default async function Home() {
  const posts = await getPosts();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Hero Section */}
      <div className="text-center mb-20">
        <div className="mb-8">
          <Image
            src="/image.png"
            alt="Suburban Dad Mode"
            width={300}
            height={300}
            className="mx-auto rounded-lg shadow-lg"
            priority
          />
        </div>
        <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-sdm-text mb-6 leading-tight">
          Welcome to<br />
          <span className="text-sdm-primary">Suburban Dad Mode</span>
        </h1>
        <p className="font-cooper text-xl sm:text-2xl text-sdm-text-light max-w-3xl mx-auto leading-relaxed">
          Life, parenting, and everything in between from the suburbs. 
          Join me as I navigate the wonderful chaos of suburban dad life.
        </p>
      </div>
      
      {/* Posts Section */}
      {posts.length > 0 && (
        <div className="mb-16">
          <h2 className="font-display text-3xl font-bold text-sdm-text mb-8">
            Latest Posts
          </h2>
          <PostList posts={posts} />
        </div>
      )}
      
      {/* Getting Started Section */}
      {posts.length === 0 && (
        <div className="bg-sdm-card rounded-lg p-8 sm:p-12 shadow-sm border border-warm-gray-200">
          <div className="text-center">
            <div className="w-20 h-20 bg-sdm-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-sdm-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            
            <h2 className="font-display text-3xl font-bold text-sdm-text mb-4">
              Ready to Start Blogging?
            </h2>
            
            <p className="font-cooper text-lg text-sdm-text-light mb-8 max-w-2xl mx-auto">
              Your Suburban Dad Mode blog is all set up! Just complete the Sanity CMS setup to start sharing your suburban adventures.
            </p>
            
            <div className="bg-warm-gray-50 rounded-lg p-6 max-w-2xl mx-auto">
              <h3 className="font-cooper text-lg font-semibold text-sdm-text mb-4">
                Quick Setup Steps:
              </h3>
              <ol className="text-left space-y-3 text-sdm-text-light">
                <li className="flex items-start">
                  <span className="inline-flex items-center justify-center w-6 h-6 bg-sdm-primary text-white rounded-full text-sm font-bold mr-3 mt-0.5 flex-shrink-0">
                    1
                  </span>
                  <span className="font-cooper">Complete your Sanity project setup with your project ID</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-flex items-center justify-center w-6 h-6 bg-sdm-primary text-white rounded-full text-sm font-bold mr-3 mt-0.5 flex-shrink-0">
                    2
                  </span>
                  <span className="font-cooper">Start the Sanity Studio and create your author profile</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-flex items-center justify-center w-6 h-6 bg-sdm-primary text-white rounded-full text-sm font-bold mr-3 mt-0.5 flex-shrink-0">
                    3
                  </span>
                  <span className="font-cooper">Write your first suburban dad adventure post!</span>
                </li>
              </ol>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
