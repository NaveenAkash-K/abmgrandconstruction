export interface Project {
  id: string;
  title: string;
  location: string;
  description: string;
  image: string;
  status: 'Completed' | 'In Progress' | 'Planning';
  createdAt: string;
  updatedAt: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  active: boolean;
}

export interface Client {
  id: string;
  name: string;
  logo?: string;
  active: boolean;
}

export interface WhyChooseReason {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface AboutData {
  description: string;
  yearsExperience: string;
  completedProjects: string;
  locationsServed: string;
}

export interface ContactInfo {
  address: string;
  city: string;
  country: string;
  phone1: string;
  phone2: string;
  email1: string;
  email2: string;
  businessHours: {
    weekdays: string;
    saturday: string;
    sunday: string;
  };
}

export interface DashboardStats {
  totalProjects: number;
  activeServices: number;
  totalClients: number;
  pageViews: number;
}