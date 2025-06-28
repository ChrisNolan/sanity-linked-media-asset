# Linked Media Asset Plugin

This plugin provides a way to define image fields in Sanity Studio that are "linked" to the fields of the referenced media asset. It allows you to view, edit, and sync fields (like title, alt text, description, credit line, etc.) between your document and the asset, directly from the studio.

## Features

- **LinkedMediaAssetField**: A custom input component for string fields that shows both the local value and the value from the referenced asset, with the ability to copy or update between them.
- **getLinkedMediaAssetFields**: A helper function to easily add a configurable set of standard asset fields to any image field in your schema, with a simple options API.

## Usage

### 1. Add Linked Asset Fields to an Image

In your schema, use the `getLinkedMediaAssetFields` helper to add standard fields to an image field:

```ts
import {defineField} from 'sanity'
import {getLinkedMediaAssetFields} from './schemaTypes/linkedMediaAssetFields'

defineField({
  name: 'image',
  type: 'image',
  fields: [
    ...getLinkedMediaAssetFields({
      title: {enabled: true}, // enabled by default
      altText: {enabled: true}, // enabled by default
      description: {enabled: true}, // enabled by default
      creditLine: {enabled: true}, // disabled by default, enable if needed
    }),
    // any custom fields
  ],
})
```

#### Accepted Option Keys

The following keys are accepted in the options object for `getLinkedMediaAssetFields`:

- `title` (enabled by default)
- `altText` (enabled by default)
- `description` (enabled by default)
- `creditLine` (disabled by default, enable if needed)

All fields except `creditLine` are enabled by default. You can disable any by passing `{fieldName: {enabled: false}}`.
`creditLine` is only included if you explicitly set `{creditLine: {enabled: true}}`.

**Note:** If you pass any unknown keys to `getLinkedMediaAssetFields`, an error will be thrown in development mode to help catch typos or misconfigurations. Only the keys listed above are accepted.

### 2. What does the input look like?

Each field using `LinkedMediaAssetField` will show:

- The local value (editable)
- The asset value (editable, updates the asset)
- A button to copy the asset value to the local field

### 3. Customization

You can add more fields to the helper or customize the UI as needed. The helper is DRY and easy to extend.

You can now also add a field to your image's `fields[]` that will persist to the asset as well. e.g.

```typescript
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
          description: "This field doesn't normally exist on the image asset... but now it will!",
          type: 'string',
          components: {
            input: LinkedMediaAssetField,
          },
        }),
      ],
    }),
```

### 4. GROQ Query Example: Coalescing Local and Asset Fields

When querying your documents, you may want to get the local value for each field if set, or fall back to the value from the linked asset. You can do this with GROQ's `coalesce()` function. For example:

```groq
*[_type == "yourDocumentType"]{
  ...,
  image{
    ...,
    // Coalesce each field: prefer local, fall back to asset
    "title": coalesce(title, asset->title),
    "altText": coalesce(altText, asset->altText),
    "description": coalesce(description, asset->description),
    "creditLine": coalesce(creditLine, asset->creditLine),
    "customField": coalesce(customField, asset->customField),
    // Add more fields as needed
    // You can also include the asset reference or other fields
    asset->{_id, url}
  }
}
```

This will return the local value if present, otherwise the value from the referenced asset.

---

## sanity-media-plugin PR potential

Perhaps it'll be better as a PR on the [sanity-media-plugin](https://github.com/sanity-io/sanity-plugin-media/) itself? Oh... look at that under 'known issues' we have

```text
There isn't a way to edit asset fields directly from the desk (without opening the plugin)

- This is a bit of a sticking point, especially when working with large datasets
- For example, if you want to edit fields for an already selected image – you'll need to go into the plugin and then have to manually find that image (which can be laborious when sifting through thousands of assets)
- A future update will provide the ability to 'jump' straight to a selected asset
- However, exposing plugin fields directly on the desk (e.g. via a custom input component) is currently outside the scope of this project
```

So this bit is the part that they say is out of scope of the project so... maybe I can make this a 'package' on its own? :thinking: [This PR](https://github.com/sanity-io/sanity-plugin-media/pull/216) is set to give an 'edit image' link but it has been a year with no action on it.
