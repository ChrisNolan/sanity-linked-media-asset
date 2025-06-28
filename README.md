# Linked Media Asset Plugin

A quick attempt at making a tool which will allow one to define a field as a 'linked asset' where check boxes (?) will be put beside the additional fields in order to 'sync' the contents of those fields with the contents of the media plugin's additional fields.

## sanity-media-plugin PR potential

Perhaps it'll be better as a PR on the [sanity-media-plugin](https://github.com/sanity-io/sanity-plugin-media/) itself? Oh... look at that under 'known issues' we have

```text
There isn't a way to edit asset fields directly from the desk (without opening the plugin)

- This is a bit of a sticking point, especially when working with large datasets
- For example, if you want to edit fields for an already selected image – you'll need to go into the plugin and then have to manually find that image (which can be laborious when sifting through thousands of assets)
- A future update will provide the ability to 'jump' straight to a selected asset
- However, exposing plugin fields directly on the desk (e.g. via a custom input component) is currently outside the scope of this project
```

So this is essentially what they plan to do anyway... guess this will fit that. [This PR](https://github.com/sanity-io/sanity-plugin-media/pull/216) is set to give an 'edit image' link but it has been a year with no action on it.
