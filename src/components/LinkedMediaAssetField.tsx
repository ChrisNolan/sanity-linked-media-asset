import React from 'react'
import {set, unset, StringInputProps, useFormValue, useClient} from 'sanity'
import {Box, Flex, Text, Button, TextInput, Stack, Card, Tooltip, useToast} from '@sanity/ui'
import {CopyIcon} from '@sanity/icons'

/**
 * Props for the LinkedMediaAssetField component.
 *
 * @public
 */
export interface LinkedMediaAssetFieldProps extends StringInputProps {
  apiVersion?: string
}

/**
 * Shared input component for image fields that displays the value from the linked asset (if present)
 * alongside the local field value, and allows copying or updating between them.
 *
 * - Shows both the local and asset values for a field (e.g., title, altText, etc.)
 * - Allows editing the local value and (optionally) the asset value
 * - Provides a button to copy the asset value to the local field
 * - Shows a toast notification if updating the asset fails
 *
 * @param props - See {@link LinkedMediaAssetFieldProps}
 * @public
 */
export default function LinkedMediaAssetField(props: LinkedMediaAssetFieldProps) {
  const {value, onChange, elementProps, path, apiVersion} = props
  const toast = useToast()
  // Remove onChange from elementProps to avoid duplicate prop
  const {onChange: _ignoredOnChange, ...restElementProps} = elementProps || {}
  // The parent is the image field, which is one level up in the path
  const imageField = useFormValue(path.slice(0, -1)) as any
  // The asset ref is at imageField?.asset?._ref
  const assetRef = imageField?.asset?._ref
  // The field name (e.g., 'title', 'altText', etc.)
  // Use the last segment of the path as the field name, cast to string
  const fieldName = String(path[path.length - 1])
  const [assetValue, setAssetValue] = React.useState<string | undefined>(undefined)
  const [assetInputValue, setAssetInputValue] = React.useState<string | undefined>(undefined)
  const [updatingAsset, setUpdatingAsset] = React.useState(false)

  // Use provided apiVersion or default to a stable version
  const client = useClient({apiVersion: apiVersion || '2023-08-01'})
  React.useEffect(() => {
    if (!assetRef) {
      setAssetValue(undefined)
      setAssetInputValue(undefined)
      return
    }
    // Fetch the asset document from Sanity
    // NOTE this is 'static' and not 'live by default' so...
    const fetchAsset = async () => {
      const query = `*[_id == $id][0]{${fieldName}}`
      const params = {id: assetRef}
      const asset = await client.fetch(query, params)
      setAssetValue(asset?.[fieldName])
      setAssetInputValue(asset?.[fieldName] ?? '')
    }
    fetchAsset()
  }, [assetRef, fieldName, client])

  return (
    <Card padding={3} radius={2}>
      <Flex direction="row" align="flex-end" gap={3}>
        <Box flex={1}>
          <Stack space={2}>
            <Text size={1} weight="medium">
              Local
            </Text>
            <TextInput
              value={value || ''}
              onChange={(e) =>
                onChange(e.currentTarget.value ? set(e.currentTarget.value) : unset())
              }
              placeholder={`Enter ${fieldName}`}
              {...restElementProps}
            />
          </Stack>
        </Box>
        {assetValue !== undefined && (
          <>
            <Box flex={1}>
              <Stack space={2}>
                <Text size={1} weight="medium">
                  Asset
                </Text>
                <TextInput
                  value={assetInputValue || ''}
                  onChange={(e) => setAssetInputValue(e.currentTarget.value)}
                  onBlur={async () => {
                    if (!assetRef || assetInputValue === assetValue) return
                    setUpdatingAsset(true)
                    try {
                      await client
                        .patch(assetRef)
                        .set({[fieldName]: assetInputValue})
                        .commit()
                      setAssetValue(assetInputValue)
                    } catch (err) {
                      toast.push({
                        status: 'error',
                        title: 'Failed to update asset',
                        description: err instanceof Error ? err.message : String(err),
                      })
                    } finally {
                      setUpdatingAsset(false)
                    }
                  }}
                  placeholder={`Asset ${fieldName}`}
                  style={{minWidth: 120}}
                  disabled={updatingAsset}
                />
              </Stack>
            </Box>
            <Box paddingTop={4}>
              <Tooltip content="Copy asset value to local field">
                <Button
                  icon={CopyIcon}
                  mode="bleed"
                  padding={2}
                  aria-label="Copy from asset"
                  onClick={() => onChange(set(assetValue))}
                  disabled={value === assetValue}
                />
              </Tooltip>
            </Box>
          </>
        )}
      </Flex>
    </Card>
  )
}
