import {defineConfig} from 'sanity'
import {media, type MediaToolOptions} from 'sanity-plugin-media'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './src/schemaTypes'

const mediaConfig: MediaToolOptions = {
  creditLine: {enabled: true},
}

export default defineConfig({
  name: 'default',
  title: 'linked-media-asset-plugin',

  projectId: 'of7fq0dg',
  dataset: 'development',

  plugins: [structureTool(), visionTool(), media(mediaConfig)],

  schema: {
    types: schemaTypes,
  },
})
