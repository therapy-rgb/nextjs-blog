import { logError } from '@/lib/logging'
import type { GitHubCommit, ChangelogEntry, ChangelogMonth } from '@/types/sanity'

const REPO = 'therapy-rgb/nextjs-blog'

const FILTERED_PREFIXES = ['Merge ', 'chore:', 'docs:', 'ci:', 'build:', 'style:']

const CONVENTIONAL_PREFIXES = ['feat:', 'fix:', 'refactor:', 'perf:', 'test:', 'chore:', 'docs:', 'ci:', 'build:', 'style:']

function shouldFilter(message: string): boolean {
  const firstLine = message.split('\n')[0].trim()

  if (FILTERED_PREFIXES.some(p => firstLine.startsWith(p))) return true
  if (/skill/i.test(firstLine)) return true

  const cleaned = cleanMessage(firstLine)
  if (cleaned.length < 15) return true

  return false
}

function cleanMessage(firstLine: string): string {
  let msg = firstLine

  for (const prefix of CONVENTIONAL_PREFIXES) {
    if (msg.toLowerCase().startsWith(prefix)) {
      msg = msg.slice(prefix.length).trim()
      break
    }
  }

  return msg.charAt(0).toUpperCase() + msg.slice(1)
}

function toEntry(commit: GitHubCommit): ChangelogEntry {
  const firstLine = commit.commit.message.split('\n')[0].trim()
  return {
    sha: commit.sha,
    message: cleanMessage(firstLine),
    date: commit.commit.committer.date,
    url: commit.html_url,
  }
}

function groupByMonth(entries: ChangelogEntry[]): ChangelogMonth[] {
  const map = new Map<string, ChangelogEntry[]>()

  for (const entry of entries) {
    const d = new Date(entry.date)
    const yearMonth = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    const existing = map.get(yearMonth)
    if (existing) {
      existing.push(entry)
    } else {
      map.set(yearMonth, [entry])
    }
  }

  return Array.from(map.entries()).map(([yearMonth, entries]) => {
    const [year, month] = yearMonth.split('-')
    const label = new Date(Number(year), Number(month) - 1).toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    })
    return { label, yearMonth, entries }
  })
}

export async function getChangelog(): Promise<ChangelogMonth[]> {
  const token = process.env.GITHUB_TOKEN
  if (!token) return []

  try {
    const res = await fetch(`https://api.github.com/repos/${REPO}/commits?per_page=100`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
      },
      next: { revalidate: 86400 },
    })

    if (!res.ok) {
      logError('general', `GitHub API returned ${res.status}`, { status: res.status })
      return []
    }

    const commits: GitHubCommit[] = await res.json()

    const entries = commits
      .filter(c => !shouldFilter(c.commit.message))
      .map(toEntry)

    return groupByMonth(entries)
  } catch (error) {
    logError('general', 'Error fetching changelog', {
      error: error instanceof Error ? error.message : String(error),
    })
    return []
  }
}
