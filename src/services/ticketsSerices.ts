import axiosClient from "./axiosClient";
import {
  POST_CREATE_TICKET,
  GET_TICKETS,
  GET_TICKET_DETAILS,
  POST_ASSIGN_TICKET,
} from "./constants";

const ticketsSerices = {
  async uploadExcel(formData: FormData): Promise<any> {
    const response = await axiosClient.post(POST_CREATE_TICKET, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  },

  async getTickets(AccountID: number, schoolIDs: string): Promise<any> {
    const response = await axiosClient.get(
      `${GET_TICKETS}?AccountID=${AccountID}&SchoolIDs=${schoolIDs}`,
    );
    return response;
  },

  async getTicketDetails(ticketId: number): Promise<any> {
    const response = await axiosClient.get(
      GET_TICKET_DETAILS.replace("{ticketId}", ticketId.toString()),
    );
    return response;
  },

  async assignTicketsToUser(ticketIds: string, userId: number): Promise<any> {
    const response = await axiosClient.post(POST_ASSIGN_TICKET, {
      TicketIDs: ticketIds,
      AssignedTo: userId,
    });
    return response;
  },
};

export default ticketsSerices;
