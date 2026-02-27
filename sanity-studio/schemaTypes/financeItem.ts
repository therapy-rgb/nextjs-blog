import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'financeItem',
  title: 'Finance Item',
  type: 'document',
  icon: () => '💰',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Task or item description',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'group',
      title: 'Group',
      type: 'string',
      description: 'Which finance group this belongs to',
      options: {
        list: [
          {title: 'Taxes 2025', value: 'taxes-2025'},
        ],
        layout: 'radio',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
      description: 'Sort order within group (lower numbers appear first)',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      group: 'group',
    },
    prepare(selection) {
      const {title, group} = selection
      const groupLabels: Record<string, string> = {
        'taxes-2025': 'Taxes 2025',
      }
      return {
        title,
        subtitle: group ? groupLabels[group] ?? group : 'No group',
      }
    },
  },
  orderings: [
    {
      title: 'Group, then Order',
      name: 'groupOrder',
      by: [
        {field: 'group', direction: 'asc'},
        {field: 'order', direction: 'asc'},
      ],
    },
  ],
})
