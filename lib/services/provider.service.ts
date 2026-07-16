import { MockProfessional } from "../repositories/provider.repository";
export type { MockProfessional };

export class ProviderService {
  async getProviders(): Promise<MockProfessional[]> {
    const res = await fetch("/api/staff", { cache: "no-store", next: { revalidate: 0 } });
    const data = await res.json();
    if (!data.success) throw new Error(data.error || "Failed to fetch staff");
    return (data.staff || []).map(this.mapToMockProfessional);
  }

  async getProviderById(id: string): Promise<MockProfessional | undefined> {
    const list = await this.getProviders();
    return list.find((p) => p.id === id);
  }

  private mapToMockProfessional(p: any): MockProfessional {
    return {
      id: p.id,
      fullName: p.fullName || "Care Professional",
      category: p.category || (p.role?.toLowerCase() === "nurse" ? "Nurses" : (p.role?.toLowerCase() === "physiotherapist" ? "Physiotherapists" : "Caregivers")),
      experience: typeof p.experience === "string" ? p.experience : `${p.experienceYears || 2} Years`,
      languages: p.languages || ["English", "Telugu"],
      rating: Number(p.rating || 5.0),
      verified: p.status === "active" || p.verified || false,
      organization: p.organization || "HomeCare Partner",
      photo: p.avatarUrl || p.photo || "",
      availability: p.availability || "Available Today",
    };
  }
}

export const providerService = new ProviderService();
