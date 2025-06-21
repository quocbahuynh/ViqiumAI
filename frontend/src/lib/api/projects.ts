import { ProjectBase } from "@/types/projectType";
import axiosInstance from "../axios-config"
import { ApiResponse } from "./types";
import { apiLinks } from "../api-link";


// Projects API
export const projectsApi = {
  // Get all projects
  
  getProjects: async (): Promise<ProjectBase[]> => {
    const response = await axiosInstance.get<ApiResponse<ProjectBase[]>>(apiLinks.project.list)
    return response.data.data
  },
  getProject: async (projectId: string) => {
    const response = await axiosInstance.get(`${apiLinks.project.single}/${projectId}`)
    return response.data.data
  },

  // Create a new project
  createProject: async (data: { name: string; professionId: string,  fanpageId: string, fanpageName:string , accessToken: string, avatarUrl: string }): Promise<ProjectBase> => {
    const response = await axiosInstance.post<ApiResponse<ProjectBase>>(apiLinks.project.createBase, data)
    return response.data.data
  },

  // Get project by ID
  getProjectById: async (id: string): Promise<ProjectBase> => {
    const url = apiLinks.project.getBaseInformation.replace("id", id)
    const response = await axiosInstance.get<ApiResponse<ProjectBase>>(url)
    return response.data.data
  },

  // Update project
  updateProject: async ( data: Partial<ProjectBase>, id:string) => {
    const url = `${apiLinks.project.createBase}/${id}`
    const response = await axiosInstance.put(url, data)
    return response.data.data
  },

  // Delete project
  deleteProject: async (id: string): Promise<void> => {
    const url = `${apiLinks.project.createBase}/${id}`
    await axiosInstance.delete(url)
  },

  // Connect project to fanpage
  connectFanpage: async (id: string, pageId: string): Promise<ProjectBase> => {
    const url = apiLinks.project.connectFanpage.replace("id", id)
    const response = await axiosInstance.post<ApiResponse<ProjectBase>>(url, { pageId })
    return response.data.data
  },

  // Get project pages list
  getPagesList: async (id: string): Promise<Record<string, unknown>[]> => {
    const url = apiLinks.project.pagesList.replace("id", id)
    const response = await axiosInstance.get<ApiResponse<Record<string, unknown>[]>>(url)
    return response.data.data
  },
}
