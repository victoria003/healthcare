import { SupportRepository } from "../repositories/supportRepository";

export const SupportService = {
  async handleNewTicket(ticket: any) {
    if (!ticket.subject || !ticket.message) {
      throw new Error("Subject and Message are required to create a ticket.");
    }
    return SupportRepository.createTicket(ticket);
  },

  async handleComplaintEscalation(complaintId: string, level: 1 | 2 | 3) {
    // Escalate complaints
    return {
      complaintId,
      escalationTarget: level === 3 ? "Platform Super Administrator" : "Regional Coordinator",
      timestamp: new Date().toISOString()
    };
  }
};
