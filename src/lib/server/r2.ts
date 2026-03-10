import { getCloudflareContext } from '@opennextjs/cloudflare'

type R2Bucket = {
  get(key: string): Promise<R2Object | null>
  put(key: string, value: ReadableStream | ArrayBuffer | string, options?: R2PutOptions): Promise<R2Object>
  delete(key: string): Promise<void>
  list(options?: R2ListOptions): Promise<R2ObjectList>
}

type R2Object = {
  key: string
  size: number
  uploaded: Date
  httpMetadata?: { contentType?: string }
  body?: ReadableStream
  arrayBuffer(): Promise<ArrayBuffer>
}

type R2PutOptions = {
  httpMetadata?: { contentType?: string }
}

type R2ListOptions = {
  prefix?: string
  limit?: number
  cursor?: string
}

type R2ObjectList = {
  objects: Array<{ key: string; size: number; uploaded: Date }>
  truncated: boolean
  cursor?: string
}

async function getBucket(): Promise<R2Bucket> {
  const context = await getCloudflareContext({ async: true })
  const bucket = (context.env as Record<string, unknown>).MEDIA_BUCKET as R2Bucket | undefined

  if (!bucket) {
    throw new Error('Missing Cloudflare R2 binding: MEDIA_BUCKET')
  }

  return bucket
}

export async function getMediaObject(key: string) {
  const bucket = await getBucket()
  const object = await bucket.get(key)

  if (!object || !object.body) {
    return null
  }

  return {
    body: object.body,
    contentType: object.httpMetadata?.contentType ?? 'application/octet-stream',
    size: object.size,
  }
}

export async function putMediaObject(key: string, body: ArrayBuffer, contentType: string) {
  const bucket = await getBucket()
  await bucket.put(key, body, { httpMetadata: { contentType } })
}

export async function deleteMediaObject(key: string) {
  const bucket = await getBucket()
  await bucket.delete(key)
}

export async function listMediaObjects(prefix?: string) {
  const bucket = await getBucket()
  const result = await bucket.list({ prefix, limit: 1000 })

  return result.objects.map((obj) => ({
    key: obj.key,
    size: obj.size,
    lastModified: obj.uploaded.toISOString(),
  }))
}
