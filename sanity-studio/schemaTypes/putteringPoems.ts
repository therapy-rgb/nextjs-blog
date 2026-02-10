import {defineField, defineType, defineArrayMember} from 'sanity'

export default defineType({
  name: 'putteringPoems',
  title: 'Puttering Poems',
  type: 'document',
  icon: () => '✍️',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      initialValue: 'Puttering',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'poems',
      title: 'Poems',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'slug',
              title: 'Slug',
              type: 'slug',
              options: {
                source: 'title',
              },
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'text',
              title: 'Poem Text',
              type: 'text',
              description: 'Plain text with line breaks preserved',
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: {
              title: 'title',
            },
          },
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
    },
  },
})
