import { mockProfessionals } from "@/data/mock/explore";

export interface MockProfessional {
  id: string;
  fullName: string;
  category: string;
  experience: string;
  languages: string[];
  rating: number;
  verified: boolean;
  organization: string;
  photo: string;
  availability: string;
}

export class ProviderRepository {
  async getProviders(): Promise<MockProfessional[]> {
    return mockProfessionals as MockProfessional[];
  }

  async getProviderById(id: string): Promise<MockProfessional | undefined> {
    return (mockProfessionals as MockProfessional[]).find((p) => p.id === id);
  }
}

export const providerRepository = new ProviderRepository();
