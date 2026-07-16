import { mockOrganizations } from "@/data/mock/explore";

export interface MockOrganization {
  id: string;
  name: string;
  logo: string;
  services: string[];
  location: string;
  rating: number;
  verified: boolean;
}

export class OrganizationRepository {
  async getOrganizations(): Promise<MockOrganization[]> {
    return mockOrganizations as MockOrganization[];
  }

  async getOrganizationById(id: string): Promise<MockOrganization | undefined> {
    return (mockOrganizations as MockOrganization[]).find((o) => o.id === id);
  }
}

export const organizationRepository = new OrganizationRepository();
