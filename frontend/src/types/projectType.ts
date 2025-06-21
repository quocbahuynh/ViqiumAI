// Add the image property to the ProjectBase interface
export interface ProjectBase {
  _id: string
  name: string
  active: boolean
  createdAt: string
  profession: {
    name: string
  }
  fannpage: any
  image?: string
}

  export interface ProfessionSelected{
    value: string;
    label: string;
}