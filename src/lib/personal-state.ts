import { z } from 'zod'

export const vfsEntryTypeSchema = z.enum(['file', 'folder'])

const integerSchema = z.number().int()
const positiveIntegerSchema = z.number().int().positive()

export const vfsEntrySchema = z.object({
  id: z.string().min(1),
  parentId: z.string().nullable(),
  name: z.string().min(1),
  type: vfsEntryTypeSchema,
  content: z.string().nullable(),
  mimeType: z.string().nullable(),
  size: integerSchema.min(0),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

export const vfsCreateInputSchema = z.object({
  parentId: z.string().nullable().optional(),
  name: z.string().min(1),
  type: vfsEntryTypeSchema,
  content: z.string().optional(),
  mimeType: z.string().optional(),
})

export const vfsUpdateInputSchema = z.object({
  parentId: z.string().nullable().optional(),
  name: z.string().min(1).optional(),
  content: z.string().optional(),
  mimeType: z.string().nullable().optional(),
})

export const vfsListResponseSchema = z.object({
  parent: vfsEntrySchema,
  entries: z.array(vfsEntrySchema),
})

const boundsSchema = z.object({
  x: integerSchema,
  y: integerSchema,
  width: positiveIntegerSchema,
  height: positiveIntegerSchema,
})

export const storedWindowStateSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  icon: z.string().min(1),
  component: z.string().min(1),
  props: z.record(z.string(), z.unknown()).optional(),
  isMinimized: z.boolean(),
  isMaximized: z.boolean(),
  position: z.object({
    x: integerSchema,
    y: integerSchema,
  }),
  size: z.object({
    width: positiveIntegerSchema,
    height: positiveIntegerSchema,
  }),
  zIndex: integerSchema,
  preMaxBounds: boundsSchema.nullable().optional(),
})

export const storedWindowStatesSchema = z.object({
  windows: z.array(storedWindowStateSchema),
})

export type VfsEntryType = z.infer<typeof vfsEntryTypeSchema>
export type VfsEntry = z.infer<typeof vfsEntrySchema>
export type VfsCreateInput = z.infer<typeof vfsCreateInputSchema>
export type VfsUpdateInput = z.infer<typeof vfsUpdateInputSchema>
export type StoredWindowState = z.infer<typeof storedWindowStateSchema>