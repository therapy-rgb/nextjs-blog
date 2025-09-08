import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {colorInput} from '@sanity/color-input'
import {imageHotspotArrayPlugin} from 'sanity-plugin-hotspot-array'

import {schemaTypes} from './schemaTypes'
import {structure} from './structure'

export default defineConfig({
  name: 'personal-blog',
  title: 'Personal Blog',

  projectId: process.env.SANITY_STUDIO_PROJECT_ID || 'your-project-id',
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',

  plugins: [
    structureTool({structure}),
    visionTool(),
    colorInput(),
    imageHotspotArrayPlugin(),
  ],

  schema: {
    types: schemaTypes,
  },

  // Configure the document panes
  document: {
    newDocumentOptions: (prev, {creationContext}) => {
      if (creationContext.type === 'global') {
        return prev.filter((templateItem) => templateItem.templateId !== 'settings')
      }
      return prev
    },
  },
})