import {defineField, defineType} from 'sanity'
import {getLinkedMediaAssetFields} from '../../../src/linkedMediaAssetFields'
import LinkedMediaAssetField from '../../../src/LinkedMediaAssetField'

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
        ...getLinkedMediaAssetFields({creditLine: {enabled: true}}),
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
