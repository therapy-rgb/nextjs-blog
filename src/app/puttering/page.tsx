import { client, putteringPoemsQuery } from '@/lib/sanity'
import type { PutteringPoems } from '@/types/sanity'
import PutteringContent from './PutteringContent'

export const revalidate = 3600

export default async function Puttering() {
  const data = await client.fetch<PutteringPoems | null>(putteringPoemsQuery)
  const poems = data?.poems ?? []

  return <PutteringContent poems={poems} />
}
