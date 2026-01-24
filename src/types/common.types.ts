export interface PaginationParams {
  page: number
  pageSize: number
}

export interface PaginationResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
}

export interface ApiError {
  message: string
  errors?: Record<string, string[]>
  statusCode?: number
}

