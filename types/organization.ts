export interface Organization {
  id: string;
  name: string;
  logo: string;
  verified: boolean;
  rating: number;
}

export interface OrganizationBranch {
  id: string;
  city: string;
  state: string;
}

export interface OrganizationService {
  id: string;
  name: string;
}
