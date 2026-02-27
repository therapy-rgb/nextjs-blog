import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'carItem',
  title: 'Car Item',
  type: 'document',
  icon: () => '🚗',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'What needs to be done (e.g., "Oil change")',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'car',
      title: 'Car',
      type: 'string',
      description: 'Which vehicle this applies to',
      options: {
        list: [
          {title: 'Rav4', value: 'rav4'},
          {title: 'Bolt EUV', value: 'bolt-euv'},
        ],
        layout: 'radio',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      description: 'Type of car task',
      options: {
        list: [
          {title: 'Maintenance', value: 'maintenance'},
          {title: 'Repairs', value: 'repairs'},
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
      car: 'car',
      category: 'category',
    },
    prepare(selection) {
      const {title, car, category} = selection
      const carLabel = car === 'rav4' ? 'Rav4' : car === 'bolt-euv' ? 'Bolt EUV' : car
      const catLabel = category ? category.charAt(0).toUpperCase() + category.slice(1) : ''
      return {
        title,
        subtitle: [carLabel, catLabel].filter(Boolean).join(' · '),
      }
    },
  },
  orderings: [
    {
      title: 'Car, Category, then Order',
      name: 'carCategoryOrder',
      by: [
        {field: 'car', direction: 'asc'},
        {field: 'category', direction: 'asc'},
        {field: 'order', direction: 'asc'},
      ],
    },
  ],
})
