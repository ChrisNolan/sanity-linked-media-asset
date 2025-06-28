import {defineField, defineType} from 'sanity'
import LinkedMediaAssetField from '../components/LinkedMediaAssetField'

export const testImageType = defineType({
  name: 'testImage',
  type: 'document',
  fields: [
    defineField({
      name: 'image',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'title',
          type: 'string',
          components: {
            input: LinkedMediaAssetField,
          },
        }),
        defineField({
          name: 'altText',
          type: 'string',
          components: {
            input: LinkedMediaAssetField,
          },
        }),
        defineField({
          name: 'description',
          type: 'string',
          components: {
            input: LinkedMediaAssetField,
          },
        }),
        defineField({
          name: 'creditLine',
          type: 'string',
          components: {
            input: LinkedMediaAssetField,
          },
        }),
        defineField({
          name: 'customField',
          description: "This field doesn't normally exist on the image asset... but now it will?",
          type: 'string',
          components: {
            input: LinkedMediaAssetField,
          },
        }),
      ],
    }),
  ],
})
