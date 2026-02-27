/**
 * One-time script to seed Sanity with links from OPML file.
 * Run: node scripts/seed-links.mjs
 */
import { createClient } from '@sanity/client'
import { config } from 'dotenv'

config({ path: '.env.local' })

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2025-01-12',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

// Curated from OPML, deduped, own site removed, names cleaned up
const links = [
  { name: 'Alexander Sandberg', url: 'https://alexandersandberg.com/' },
  { name: 'Anil Dash', url: 'https://www.anildash.com/' },
  { name: 'Aresluna', url: 'https://aresluna.org/' },
  { name: 'Ariel Salminen', url: 'https://arielsalminen.com/' },
  { name: 'Charlotte Dann', url: 'https://charlottedann.com/' },
  { name: 'Craig Mod', url: 'https://craigmod.com/' },
  { name: 'Email is Good', url: 'https://email-is-good.com/' },
  { name: 'Eva Town', url: 'https://eva.town/' },
  { name: 'Frontend Masters', url: 'https://frontendmasters.com/blog/' },
  { name: 'Ftrain', url: 'https://www.ftrain.com/' },
  { name: 'Kellan Elliott-McCrea', url: 'https://laughingmeme.org/' },
  { name: 'LMNT', url: 'https://lmnt.me/' },
  { name: 'Lea Verou', url: 'https://verou.me/' },
  { name: 'Lynn Fisher', url: 'https://lynnandtonic.com/' },
  { name: 'Maggie Appleton', url: 'https://maggieappleton.com/' },
  { name: 'Naz Hamid', url: 'https://nazhamid.com/' },
  { name: 'Rasmus Andersson', url: 'https://rsms.me/' },
  { name: 'Robin Rendle', url: 'https://robinrendle.com/' },
  { name: 'Robin Sloan', url: 'https://www.robinsloan.com/' },
  { name: 'Ryan Mulligan', url: 'https://ryanmulligan.dev/' },
  { name: 'Simon Willison', url: 'https://simonwillison.net/' },
  { name: 'The Cascade', url: 'https://csscade.com/' },
  { name: 'Unsung', url: 'https://unsung.aresluna.org/' },
  { name: 'V.H. Belvadi', url: 'https://vhbelvadi.com/' },
  { name: 'anhvn', url: 'https://anhvn.com/' },
  { name: 'Arun', url: 'https://arun.is/' },
  { name: 'Dave Rupert', url: 'https://daverupert.com/' },
  { name: 'iamrobin', url: 'https://www.iamrob.in/' },
  { name: 'kottke.org', url: 'https://kottke.org/' },
  { name: 'Sajal Sharma', url: 'https://sajalsharma.com/' },
  { name: 'NowNowNow', url: 'https://nownownow.com/' },
]

async function seed() {
  // Check for existing links to avoid duplicates
  const existing = await client.fetch('*[_type == "link"]{ url }')
  const existingUrls = new Set(existing.map((l) => l.url))

  const toCreate = links.filter((l) => !existingUrls.has(l.url))

  if (toCreate.length === 0) {
    console.log('All links already exist in Sanity. Nothing to do.')
    return
  }

  console.log(`Creating ${toCreate.length} links...`)

  const transaction = client.transaction()
  toCreate.forEach((link, i) => {
    transaction.create({
      _type: 'link',
      name: link.name,
      url: link.url,
      order: i,
    })
  })

  const result = await transaction.commit()
  console.log(`Done! Created ${toCreate.length} links.`, result.documentIds?.length, 'documents')
}

seed().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
