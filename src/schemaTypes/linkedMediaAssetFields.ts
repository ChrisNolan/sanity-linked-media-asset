/**
 * Returns an array of linked asset text fields for use inside an image field.
 * Each field uses the LinkedMediaAssetField component for local/asset value sync.
 *
 * Usage:
 *   import {getLinkedMediaAssetFields} from './linkedMediaAssetFields'
 *   ...
 *   fields: [
 *     defineField({
 *       name: 'image',
 *       type: 'image',
 *       fields: [
 *         ...getLinkedMediaAssetFields({
 *           title: {enabled: true},
 *           altText: {enabled: true},
 *           description: {enabled: true},
 *           creditLine: {enabled: true},
 *         }),
 *         // any custom fields
 *       ],
 *     }),
 *   ]
 */
import {defineField, FieldDefinition} from 'sanity'
import LinkedMediaAssetField from '../components/LinkedMediaAssetField'

/**
 * Type alias for the field definitions returned by getLinkedMediaAssetFields.
 */
export type LinkedMediaAssetFieldDefinition = FieldDefinition

export interface LinkedMediaAssetFieldsOptions {
  title?: {enabled: boolean}
  altText?: {enabled: boolean}
  description?: {enabled: boolean}
  creditLine?: {enabled: boolean}
  // Add more fields as needed
}

export function getLinkedMediaAssetFields(
  options: LinkedMediaAssetFieldsOptions = {},
): LinkedMediaAssetFieldDefinition[] {
  const fieldNames: Array<keyof LinkedMediaAssetFieldsOptions> = [
    'title',
    'altText',
    'description',
    'creditLine',
    // Add more fields as needed
  ]
  return fieldNames
    .filter((name) => {
      if (name === 'creditLine') {
        // creditLine is false by default
        return options.creditLine?.enabled === true
      }
      // All others are true by default unless explicitly disabled
      return options[name]?.enabled !== false
    })
    .map((name) =>
      defineField({
        name,
        type: 'string',
        components: {input: LinkedMediaAssetField},
      }),
    )
}
