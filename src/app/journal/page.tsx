import Link from 'next/link'
import Image from 'next/image'
import { format } from 'date-fns'
import { MdRssFeed } from 'react-icons/md'
import { client, postsListQuery, defaultAuthor } from "@/lib/sanity";
import { Post, PostListItem } from "@/types/sanity";
import { PageContainer } from "@/components/layout";
import { logError } from "@/lib/logging";
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Journal | Suburban Dad Mode',
  description: 'Read stories about life, parenting, and everything in between from the suburbs.',
  alternates: {
    canonical: 'https://suburbandadmode.com/journal',
  },
  openGraph: {
    title: 'Journal | Suburban Dad Mode',
    description: 'Read stories about life, parenting, and everything in between from the suburbs.',
    url: 'https://suburbandadmode.com/journal',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Journal | Suburban Dad Mode',
    description: 'Read stories about life, parenting, and everything in between from the suburbs.',
  },
}

export const revalidate = 3600; // Revalidate every hour (sufficient for personal blog)

interface MonthGroup {
  month: string;
  posts: Post[];
}

interface YearGroup {
  year: string;
  months: MonthGroup[];
}

function groupPostsByYearAndMonth(posts: Post[]): YearGroup[] {
  const groups: YearGroup[] = [];

  for (const post of posts) {
    const date = new Date(post.publishedAt);
    const year = format(date, 'yyyy');
    const month = format(date, 'MMMM');

    let yearGroup = groups.find(g => g.year === year);
    if (!yearGroup) {
      yearGroup = { year, months: [] };
      groups.push(yearGroup);
    }

    let monthGroup = yearGroup.months.find(m => m.month === month);
    if (!monthGroup) {
      monthGroup = { month, posts: [] };
      yearGroup.months.push(monthGroup);
    }

    monthGroup.posts.push(post);
  }

  return groups;
}

// Static images for posts (slug → filename in /images/journal/)
const postImages: Record<string, string> = {
  'alternatives-to-consumption': '/images/journal/alternatives-to-consumption.webp',
  'all-caught-up': '/images/journal/all-caught-up.webp',
  'writing-is-pure-luxury': '/images/journal/writing-is-pure-luxury.webp',
  'february-freeze': '/images/journal/february-freeze.webp',
  'florida': '/images/journal/florida.webp',
  'meetings': '/images/journal/meetings.webp',
  'clearing-a-path': '/images/journal/clearing-a-path.webp',
  'before-the-work-begins': '/images/journal/before-the-work-begins.webp',
  'following-up': '/images/journal/following-up.webp',
  'getting-started': '/images/journal/getting-started.webp',
  'more-snow': '/images/journal/more-snow.webp',
}

// Fallback excerpts for posts that don't have one set in Sanity
const fallbackExcerpts: Record<string, string> = {
  'florida': 'Stealing quiet moments at an oceanside condo between holiday chaos and telehealth sessions.',
  'meetings': 'The ones you endure, the ones you enjoy, and the grudging admission that sitting down together is how people actually figure things out.',
  'clearing-a-path': 'Fall obligations pile up. Underneath them, a question about whether attacking every task is diligence or avoidance.',
  'before-the-work-begins': 'A coffee shop before the day closes in, and the paradox that the life a writer tries to escape is the only material worth writing about.',
  'following-up': 'The restless urge to do and prove, and the quiet discipline of following the thread back toward stillness.',
  'getting-started': 'Choosing to write instead of nap in the slim window between walking the dog and ordering fence stain.',
}

async function getPosts(): Promise<Post[]> {
  try {
    const entries: PostListItem[] = await client.fetch(postsListQuery);
    return entries.map((entry) => ({
      ...entry,
      body: [],
      author: defaultAuthor,
      categories: []
    }));
  } catch (error) {
    logError('sanity', 'Error fetching posts', { error: error instanceof Error ? error.message : String(error) });
    return [];
  }
}

const journalRowBgs = [
  'bg-sdm-journal-1',
  'bg-sdm-journal-2',
  'bg-sdm-journal-3',
] as const;

export default async function Journal() {
  const posts = await getPosts();
  const yearGroups = groupPostsByYearAndMonth(posts);

  // Build a global color index map so colors cycle across all posts
  let globalIndex = 0;
  const postColorIndex = new Map<string, number>();
  for (const yg of yearGroups) {
    for (const mg of yg.months) {
      for (const p of mg.posts) {
        postColorIndex.set(p._id, globalIndex % 3);
        globalIndex++;
      }
    }
  }

  return (
    <PageContainer maxWidth="6xl" className="py-20">
      <div className="mb-20">
        <h1 className="font-display text-5xl md:text-6xl font-bold text-sdm-text mb-2">
          Journal
        </h1>
        <a
          href="/feed.xml"
          aria-label="Subscribe via RSS"
          className="inline-flex items-center gap-1.5 text-sm text-sdm-text-light hover:text-sdm-primary transition-colors duration-200"
        >
          <span>Subscribe via RSS</span>
          <MdRssFeed size={16} aria-hidden="true" />
        </a>
      </div>

      {yearGroups.length > 0 ? (
        <div className="space-y-16">
          {yearGroups.map((yearGroup) => (
            <section key={yearGroup.year} className="space-y-12">
              {yearGroup.months.map((monthGroup, monthIdx) => (
                <div
                  key={monthGroup.month}
                  className="flex flex-col md:flex-row md:gap-x-8"
                >
                  {/* Left: year + month labels */}
                  <div className="flex items-baseline gap-3 mb-4 md:mb-0 md:w-[260px] md:flex-shrink-0 md:pt-1">
                    {monthIdx === 0 ? (
                      <span className="font-display text-4xl md:text-5xl font-bold text-sdm-text md:min-w-[7rem]">
                        {yearGroup.year}
                      </span>
                    ) : (
                      <span className="hidden md:inline md:min-w-[7rem]" />
                    )}
                    <span className="font-display text-xl md:text-2xl italic text-sdm-text">
                      {monthGroup.month}
                    </span>
                  </div>

                  {/* Right: posts */}
                  <div className="flex-1">
                    {monthGroup.posts.map((post) => (
                      <article
                        key={post._id}
                        className={`relative ${journalRowBgs[postColorIndex.get(post._id)!]} rounded-lg px-5 py-6 mb-4 last:mb-0`}
                      >
                        <div className="flex justify-between gap-4">
                          <div className="flex-1">
                            <h2>
                              <Link
                                href={`/journal/${post.slug.current}`}
                                className="font-display text-2xl md:text-3xl text-sdm-text hover:text-sdm-primary transition-colors duration-200 after:absolute after:inset-0"
                              >
                                {post.title}
                              </Link>
                            </h2>
                            {(post.excerpt || fallbackExcerpts[post.slug.current]) && (
                              <p className="font-cooper font-light text-lg text-sdm-text-light mt-2 leading-relaxed">
                                {post.excerpt || fallbackExcerpts[post.slug.current]}
                              </p>
                            )}
                          </div>
                          <div className="flex flex-col items-end gap-2 flex-shrink-0">
                            <time
                              dateTime={post.publishedAt}
                              className="font-cooper font-light text-base md:text-lg text-sdm-primary whitespace-nowrap"
                            >
                              {format(new Date(post.publishedAt), 'MM/dd/yyyy')}
                            </time>
                            {postImages[post.slug.current] && (
                              <Image
                                src={postImages[post.slug.current]}
                                alt=""
                                width={80}
                                height={80}
                                quality={100}
                                unoptimized
                                className="rounded"
                              />
                            )}
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              ))}
            </section>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-sdm-text-light font-cooper text-lg">No entries yet.</p>
        </div>
      )}
    </PageContainer>
  );
}
