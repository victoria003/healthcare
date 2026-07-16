import { AgencyRepository } from "../repositories/agencyRepository";
import { StaffRepository } from "../repositories/staffRepository";
import { UserRole } from "../lib/types";

export const AdvancedSearchService = {
  async searchAgencies(filters: {
    category?: string;
    query?: string;
    pincode?: string;
    city?: string;
    minRating?: number;
    specialization?: string;
  }) {
    let result = await AgencyRepository.getAll();

    if (filters.city) {
      result = result.filter((a: any) => a.city.toLowerCase() === filters.city!.toLowerCase());
    }
    if (filters.pincode) {
      result = result.filter((a: any) => a.pincode === filters.pincode);
    }
    if (filters.query) {
      const q = filters.query.toLowerCase();
      result = result.filter((a: any) => a.name.toLowerCase().includes(q) || (a.description || "").toLowerCase().includes(q));
    }
    if (filters.minRating) {
      result = result.filter((a: any) => a.rating >= filters.minRating!);
    }

    return result;
  },

  async searchStaff(filters: {
    skills?: string[];
    role?: UserRole;
    experience?: number;
    rating?: number;
  }) {
    let result = await StaffRepository.getAll();

    if (filters.role) {
      result = result.filter((s: any) => s.role === filters.role);
    }
    if (filters.experience) {
      result = result.filter((s: any) => s.experienceYears >= filters.experience!);
    }
    if (filters.rating) {
      result = result.filter((s: any) => s.rating >= filters.rating!);
    }
    if (filters.skills && filters.skills.length > 0) {
      result = result.filter((s: any) => filters.skills!.some((sk: string) => (s.skills || []).includes(sk)));
    }

    return result;
  }
};
