import { MockOrganization } from "../repositories/organization.repository";
export type { MockOrganization };

export class OrganizationService {
  async getOrganizations(): Promise<MockOrganization[]> {
    const res = await fetch("/api/agencies", { cache: "no-store", next: { revalidate: 0 } });
    const data = await res.json();
    if (!data.success) throw new Error(data.error || "Failed to fetch agencies");
    return (data.agencies || []).map(this.mapToMockOrganization);
  }

  async getOrganizationById(id: string): Promise<MockOrganization | undefined> {
    const list = await this.getOrganizations();
    return list.find((o) => o.id === id);
  }

  private mapToMockOrganization(o: any): MockOrganization {
    return {
      id: o.id,
      name: o.name || "HomeCare Agency",
      logo: o.logo || o.name?.charAt(0) || "A",
      services: o.services || ["Critical Nursing", "Bedside Care", "Elder Care"],
      location: o.location || `${o.city || "Hyderabad"}, ${o.state || "Telangana"}`,
      rating: Number(o.rating || 5.0),
      verified: o.verified || o.status === "approved" || false,
    };
  }
}

export const organizationService = new OrganizationService();
