import { defineField, FieldDefinition } from "sanity";
import LinkedMediaAssetField from "./LinkedMediaAssetField";

/**
 * Type alias for the field definitions returned by getLinkedMediaAssetFields.
 * Matches the FieldDefinition type
 */
export type LinkedMediaAssetFieldDefinition = FieldDefinition;

/**
 * Options for getLinkedMediaAssetFields.
 *
 * @public
 */
export interface LinkedMediaAssetFieldsOptions {
  title?: { enabled: boolean };
  altText?: { enabled: boolean };
  description?: { enabled: boolean };
  creditLine?: { enabled: boolean };
  // Add more fields as needed
}

/**
 * Returns an array of linked asset text fields for use inside an image field.
 * Each field uses the LinkedMediaAssetField component for local/asset value sync.
 *
 * Usage:
 * ```ts
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
 * ```
 * @public
 */
export function getLinkedMediaAssetFields(
  options: LinkedMediaAssetFieldsOptions = {}
): LinkedMediaAssetFieldDefinition[] {
  /**
   * @internal
   */
  const fieldNames: Array<keyof LinkedMediaAssetFieldsOptions> = [
    "title",
    "altText",
    "description",
    "creditLine",
    // Add more fields as needed
  ];

  // Runtime check for unknown keys (dev only)
  if (process.env.NODE_ENV !== "production") {
    const allowed = new Set(fieldNames);
    const unknownKeys = Object.keys(options).filter(
      (k) => !allowed.has(k as keyof LinkedMediaAssetFieldsOptions)
    );
    if (unknownKeys.length > 0) {
      throw new Error(
        `Unknown option key(s) passed to getLinkedMediaAssetFields: ${unknownKeys.join(
          ", "
        )}.\n` + `Accepted keys: ${fieldNames.join(", ")}`
      );
    }
  }

  return fieldNames
    .filter((name) => {
      if (name === "creditLine") {
        // creditLine is false by default
        return options.creditLine?.enabled === true;
      }
      // All others are true by default unless explicitly disabled
      return options[name]?.enabled !== false;
    })
    .map((name) =>
      defineField({
        name,
        type: "string",
        // @ts-ignore - TODO repo structure issue, TS can't resolve this import
        components: { input: LinkedMediaAssetField },
      })
    );
}
