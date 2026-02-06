import { Metadata } from 'next'
import { PageContainer } from '@/components/layout'
import { ContentCard, ArrowLink } from '@/components/ui'

export const metadata: Metadata = {
  title: 'About | Suburban Dad Mode',
  description: 'Learn more about the suburban dad behind the blog and my journey through parenthood, life, and everything in between.',
  alternates: {
    canonical: 'https://suburbandadmode.com/about',
  },
  openGraph: {
    title: 'About | Suburban Dad Mode',
    description: 'Learn more about the suburban dad behind the blog and my journey through parenthood, life, and everything in between.',
    url: 'https://suburbandadmode.com/about',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'About | Suburban Dad Mode',
    description: 'Learn more about the suburban dad behind the blog and my journey through parenthood, life, and everything in between.',
  },
}

export default function About() {
  return (
    <PageContainer>
      <ContentCard padding="lg">
        <h1 className="font-display text-4xl sm:text-5xl font-bold text-sdm-text mb-8">
          About the Suburban Dad
        </h1>
        
        <div className="space-y-8 font-cooper text-lg leading-relaxed">
          <div className="text-xl text-sdm-text-light mb-8">
            <p>
              Welcome to my corner of suburbia! I&apos;m just a regular dad navigating the wonderful chaos 
              of family life, suburban adventures, and the daily juggling act that comes with being a parent.
            </p>
          </div>
          
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-sdm-text mb-4">My Story</h2>
            <p className="text-sdm-text-light">
              Like many suburban dads, my days are filled with school drop-offs, weekend sports games, 
              DIY projects that somehow turn into three-day ordeals, and the constant quest to keep 
              the lawn looking respectable. This blog is where I share the real, unfiltered experiences 
              of suburban dad life – the victories, the challenges, and the moments that make it all worthwhile.
            </p>
          </div>
          
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-sdm-text mb-4">What You&apos;ll Find Here</h2>
            <ul className="space-y-3 text-sdm-text-light">
              <li className="flex items-start">
                <span className="text-sdm-primary mr-3 font-bold">•</span>
                <span><strong className="text-sdm-text">Parenting Adventures:</strong> The ups, downs, and sideways moments of raising kids</span>
              </li>
              <li className="flex items-start">
                <span className="text-sdm-primary mr-3 font-bold">•</span>
                <span><strong className="text-sdm-text">Suburban Life:</strong> Home projects, neighborhood happenings, and community insights</span>
              </li>
              <li className="flex items-start">
                <span className="text-sdm-primary mr-3 font-bold">•</span>
                <span><strong className="text-sdm-text">Family Time:</strong> Activities, traditions, and making memories with the crew</span>
              </li>
              <li className="flex items-start">
                <span className="text-sdm-primary mr-3 font-bold">•</span>
                <span><strong className="text-sdm-text">Dad Reflections:</strong> Honest thoughts on the journey of fatherhood</span>
              </li>
              <li className="flex items-start">
                <span className="text-sdm-primary mr-3 font-bold">•</span>
                <span><strong className="text-sdm-text">Life Lessons:</strong> What I&apos;m learning along the way (often the hard way)</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-sdm-text mb-4">Why I Write</h2>
            <p className="text-sdm-text-light">
              Being a dad in suburbia can sometimes feel isolating, but it doesn&apos;t have to be. 
              I write to connect with other parents who are navigating similar experiences, to share 
              what I&apos;ve learned, and to remind myself (and you) that we&apos;re all just figuring 
              it out as we go. If something I share helps another parent feel less alone or gives 
              them a good laugh, then I&apos;ve done my job.
            </p>
          </div>
          
          <div className="bg-warm-gray-50 rounded-lg p-6">
            <h2 className="font-display text-2xl font-bold text-sdm-text mb-4">Let&apos;s Connect</h2>
            <p className="text-sdm-text-light mb-4">
              I love hearing from fellow parents and suburban adventurers. Whether you want to share 
              your own story, ask a question, or just say hello, I&apos;d love to hear from you.
            </p>
            <ArrowLink href="/contact">
              Get in touch
            </ArrowLink>
          </div>
        </div>
      </ContentCard>
    </PageContainer>
  )
}