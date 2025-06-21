// Common response type for API responses
export interface ApiResponse<T> {
    data: T
    message?: string
    success?: boolean
  }
  
  // Project types
  export interface CreateProjectRequest {
    name: string
    professionId: string
  }
  