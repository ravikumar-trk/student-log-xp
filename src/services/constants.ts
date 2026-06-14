export const LOGIN_API = "/auth/login";
export const GET_ACCOUNT_DETAILS = "/account/{accountId}/account-details";
export const GET_SCHOOLS_BY_ACCOUNT_ID = "/account/{accountId}/schools";
export const GET_USERS_BY_ACCOUNT_ID = "/account/{accountId}/users";
export const GET_CLASSES_BY_SCHOOL_ID =
  "/account/{accountId}/school/{schoolId}/classes";
export const POST_UPSERT_CLASSES = "/Account/UpsertClasses";
export const GET_STUDENTS_LIST = "/student/students";
export const POST_CREATE_TICKET = "/ticket/create-ticket";
export const GET_TICKETS = "/ticket/tickets";
export const GET_TICKET_DETAILS = "/ticket/{ticketId}/ticket-details";
export const POST_ASSIGN_TICKET = "/ticket/assign-ticket";
