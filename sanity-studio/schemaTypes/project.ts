import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  icon: () => '🛠️',
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
      options: {
        source: 'title',
        maxLength: 96,
        slugify: (input) =>
          input
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^\w-]+/g, ''),
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      description: 'Short summary (1-3 sentences)',
      validation: (rule) => rule.required().max(300),
    }),
    defineField({
      name: 'url',
      title: 'Live URL',
      type: 'url',
      description: 'Live site URL (optional for private projects)',
    }),
    defineField({
      name: 'repoUrl',
      title: 'Repository URL',
      type: 'url',
      description: 'GitHub repository URL',
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      description: 'Screenshot or hero image',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          validation: (rule) => rule.required(),
        }),
      ],
    }),
    defineField({
      name: 'techStack',
      title: 'Tech Stack',
      type: 'array',
      of: [{type: 'string'}],
      description: 'Technology tags (e.g., "Next.js 16", "Racket", "Tailwind v4")',
    }),
    defineField({
      name: 'visible',
      title: 'Visible',
      type: 'boolean',
      description: 'Controls whether this project appears on the site',
      initialValue: true,
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
      description: 'Sort order (lower numbers appear first)',
      validation: (rule) => rule.required().integer().min(0),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      order: 'order',
      media: 'image',
    },
    prepare(selection) {
      const {title, order, media} = selection
      return {
        title,
        subtitle: order !== undefined ? `#${order}` : 'No order set',
        media,
      }
    },
  },
  orderings: [
    {
      title: 'Display Order',
      name: 'orderAsc',
      by: [{field: 'order', direction: 'asc'}],
    },
  ],
})
