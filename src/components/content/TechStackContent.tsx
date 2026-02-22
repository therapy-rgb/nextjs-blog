import React from 'react'
import { PortableTextBlock } from '@portabletext/react'
import PortableText from './PortableText'

interface TechStackContentProps {
  content: PortableTextBlock[]
}

interface Section {
  heading: string
  blocks: PortableTextBlock[]
}

function groupByHeading(blocks: PortableTextBlock[]): { intro: PortableTextBlock[]; sections: Section[] } {
  const intro: PortableTextBlock[] = []
  const sections: Section[] = []
  let currentSection: Section | null = null

  for (const block of blocks) {
    if (block.style === 'h3') {
      const heading = (block.children as Array<{ text: string }>)?.map(c => c.text).join('') || ''
      currentSection = { heading, blocks: [] }
      sections.push(currentSection)
    } else if (currentSection) {
      currentSection.blocks.push(block)
    } else {
      intro.push(block)
    }
  }

  return { intro, sections }
}

export default function TechStackContent({ content }: TechStackContentProps) {
  const { intro, sections } = groupByHeading(content)

  return (
    <div>
      {intro.length > 0 && (
        <div className="prose prose-lg max-w-none font-light text-sdm-text-light mb-8">
          <PortableText content={intro} />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {sections.map((section, i) => {
          const isLastOdd = i === sections.length - 1 && sections.length % 2 === 1
          return (
            <div
              key={i}
              className={`rounded-lg border border-sdm-border bg-sdm-background p-5${isLastOdd ? ' md:col-span-2' : ''}`}
            >
              <h3 className="font-cooper text-lg text-sdm-primary font-bold mb-3 pb-2 border-b border-sdm-border">
                {section.heading}
              </h3>
              <div className="prose prose-sm max-w-none font-light [&_ul]:list-none [&_ul]:pl-0 [&_ul]:my-0 [&_li]:pl-0 [&_li]:my-1.5 [&_p]:my-2 [&_strong]:text-sdm-text [&_strong]:font-bold text-sdm-text-light">
                <PortableText content={section.blocks} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
