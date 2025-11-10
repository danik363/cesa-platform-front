export interface FileMeta {
  id?: string
  name: string
  size: number
  uploadedAt: string
  content?: string // data URL when stored client-side
}
