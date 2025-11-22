import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'journalEntry',
  title: 'Journal Entry',
  type: 'document',
  icon: () => '📔',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required().max(100),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'URL-friendly version of the title',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      description: 'Short preview text (optional)',
      rows: 3,
    }),
    defineField({
      name: 'mood',
      title: 'Mood',
      type: 'string',
      options: {
        list: [
          {title: '😊 Happy', value: 'happy'},
          {title: '😌 Calm', value: 'calm'},
          {title: '🤔 Thoughtful', value: 'thoughtful'},
          {title: '😔 Sad', value: 'sad'},
          {title: '😤 Frustrated', value: 'frustrated'},
          {title: '😴 Tired', value: 'tired'},
          {title: '🎉 Excited', value: 'excited'},
          {title: '😰 Anxious', value: 'anxious'},
        ],
        layout: 'dropdown',
      },
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'blockContent',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        layout: 'tags',
      },
    }),
    defineField({
      name: 'private',
      title: 'Private',
      type: 'boolean',
      description: 'Keep this entry private (not visible on public blog)',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      date: 'publishedAt',
      mood: 'mood',
    },
    prepare(selection) {
      const {title, date, mood} = selection
      const dateStr = date ? new Date(date).toLocaleDateString() : 'No date'
      const moodEmoji = mood ? getMoodEmoji(mood) : ''
      return {
        title,
        subtitle: `${moodEmoji} ${dateStr}`,
      }
    },
  },
  orderings: [
    {
      title: 'Date, New',
      name: 'dateDesc',
      by: [{field: 'publishedAt', direction: 'desc'}],
    },
    {
      title: 'Date, Old',
      name: 'dateAsc',
      by: [{field: 'publishedAt', direction: 'asc'}],
    },
  ],
})

function getMoodEmoji(mood: string): string {
  const moodMap: Record<string, string> = {
    happy: '😊',
    calm: '😌',
    thoughtful: '🤔',
    sad: '😔',
    frustrated: '😤',
    tired: '😴',
    excited: '🎉',
    anxious: '😰',
  }
  return moodMap[mood] || ''
}
