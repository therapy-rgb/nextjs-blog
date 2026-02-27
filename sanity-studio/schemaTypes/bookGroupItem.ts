import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'bookGroupItem',
  title: 'Book Group Item',
  type: 'document',
  icon: () => '📚',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Book title',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'string',
      description: 'Author name',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'year',
      title: 'Year',
      type: 'string',
      description: 'Year published (e.g. "1964" or "431 BCE")',
    }),
    defineField({
      name: 'meetingDate',
      title: 'Meeting Date',
      type: 'string',
      description: 'When the group discusses this book (e.g. "September 23" or "May 26 & June 23")',
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
      description: 'Sort order (lower numbers appear first)',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      author: 'author',
      meetingDate: 'meetingDate',
    },
    prepare(selection) {
      const {title, author, meetingDate} = selection
      return {
        title,
        subtitle: [author, meetingDate].filter(Boolean).join(' · '),
      }
    },
  },
  orderings: [
    {
      title: 'Order',
      name: 'orderAsc',
      by: [{field: 'order', direction: 'asc'}],
    },
  ],
})
