import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'author',
  title: 'Author',
  type: 'document',
  icon: () => '👤',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
          description: 'Important for SEO and accessibility.',
          validation: (rule) => rule.required(),
        },
      ],
    }),
    defineField({
      name: 'bio',
      title: 'Bio',
      type: 'array',
      of: [{type: 'block', styles: [{title: 'Normal', value: 'normal'}]}],
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'email',
    }),
    defineField({
      name: 'website',
      title: 'Website',
      type: 'url',
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social Links',
      type: 'object',
      fields: [
        {name: 'twitter', title: 'Twitter', type: 'string'},
        {name: 'github', title: 'GitHub', type: 'string'},
        {name: 'linkedin', title: 'LinkedIn', type: 'string'},
        {name: 'instagram', title: 'Instagram', type: 'string'},
      ],
    }),
  ],
  preview: {
    select: {
      title: 'name',
      media: 'image',
    },
  },
})