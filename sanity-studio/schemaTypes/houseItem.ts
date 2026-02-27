import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'houseItem',
  title: 'House Item',
  type: 'document',
  icon: () => '🏠',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'What needs to be done (e.g., "Sharpen knives")',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      description: 'Type of house task',
      options: {
        list: [
          {title: 'Maintenance', value: 'maintenance'},
          {title: 'Repairs', value: 'repairs'},
          {title: 'Upgrades', value: 'upgrades'},
        ],
        layout: 'radio',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
      description: 'Sort order within category (lower numbers appear first)',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      category: 'category',
    },
    prepare(selection) {
      const {title, category} = selection
      return {
        title,
        subtitle: category ? category.charAt(0).toUpperCase() + category.slice(1) : 'No category',
      }
    },
  },
  orderings: [
    {
      title: 'Category, then Order',
      name: 'categoryOrder',
      by: [
        {field: 'category', direction: 'asc'},
        {field: 'order', direction: 'asc'},
      ],
    },
  ],
})
