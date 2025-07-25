# Sanity Linked Media Asset

[![Latest version](https://img.shields.io/npm/v/sanity-linked-media-asset?label=version&color=brightGreen&logo=npm)](https://www.npmjs.com/package/sanity-linked-media-asset)
[![Open issues](https://img.shields.io/github/issues/chrisnolan/sanity-linked-media-asset)](https://github.com/chrisnolan/sanity-linked-media-asset/issues)
![React version compatibility](https://img.shields.io/badge/dynamic/json?color=blue&label=react%20versions&query=peerDependencies.react&url=https%3A%2F%2Fraw.githubusercontent.com%2Fchrisnolan%2Fsanity-linked-media-asset%2Fmain%2Fpackage.json)
![TypeScript](https://img.shields.io/badge/TypeScript-checked-blue?logo=typescript)

Expose and override image-asset fields (title, alt, …) directly in Sanity Studio.

## Overview

This plugin provides a way to define image fields in Sanity Studio that are "linked" to the fields of the referenced media asset. It allows you to view, edit, and sync fields (like title, alt text, description, credit line, etc.) between your document and the asset, directly from the studio without having to go into your [media plugin](https://github.com/sanity-io/sanity-plugin-media).

![Screenshot of plugin in use](docs/assets/screen_shot_1.png)

## Install

Install via **npm**:

```sh
npm install sanity-linked-media-asset
```

**pnpm**:

```sh
pnpm add sanity-linked-media-asset
```

**yarn**:

```sh
yarn add sanity-linked-media-asset
```

Then import and use in your Sanity Studio schema as shown below.

## Quick Start

```ts
defineField({
  name: "image",
  type: "image",
  fields: [...getLinkedMediaAssetFields()],
});
```

## Features

- **getLinkedMediaAssetFields**: A helper function to easily add a configurable set of standard asset fields to any image field in your schema, with a simple options API.
- **LinkedMediaAssetField**: A custom input component for string fields that lets you choose between using the value from the referenced asset or overriding it locally, with a clear toggle switch. It displays both the asset value and the local value (if overridden), allows editing the asset value directly, and provides a button to copy the asset value to the local field for quick overrides.

## Usage

### 1. Add Linked Asset Fields to an Image

In your schema, use the `getLinkedMediaAssetFields` helper to add standard fields to an image field:

```ts
import { defineField } from "sanity";
import { getLinkedMediaAssetFields } from "sanity-linked-media-asset";

defineField({
  name: "image",
  type: "image",
  fields: [
    ...getLinkedMediaAssetFields({
      title: { enabled: true }, // enabled by default
      altText: { enabled: true }, // enabled by default
      description: { enabled: true }, // enabled by default
      creditLine: { enabled: true }, // disabled by default, enable if needed
    }),
    // any custom fields
  ],
});
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

<details>
<summary>Information about overriding the client's apiVersion</summary>

#### API Version for Sanity Client

The `LinkedMediaAssetField` component uses Sanity's `useClient` hook to fetch and update asset data. By default, it uses the API version `2023-08-01`. If you need to override this (for example, to match your project's Sanity API version), you can set the environment variable `SANITY_STUDIO_LINKED_MEDIA_ASSET_API_VERSION` in your build or runtime environment:

```sh
export SANITY_STUDIO_LINKED_MEDIA_ASSET_API_VERSION=2025-05-01
```

This will be picked up automatically by the component (as long as your build tool exposes `SANITY_STUDIO_`-prefixed variables to the browser, which is the convention for Sanity Studio v3+). If the environment variable is not set, the default version will be used.

</details>

### 2. What does the input look like?

Each field using `LinkedMediaAssetField` provides (when there is an asset referenced):

- A toggle switch to choose whether to use the value from the linked asset or override it locally.
- When using the asset value: shows the asset value (editable, updates the asset directly).
- When overriding locally: shows the local value (editable) and a button to copy the asset value to the local field for quick overrides.
- Clear UI feedback and a placeholder message if no asset is selected yet.

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

## Change Log

See [Change Log](./CHANGELOG.md)

<details>
<summary>sanity-media-plugin musings</summary>

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

</details>

## License

MIT licence – see LICENSE
