export const ticketDTO = (ticket) => ticket ? (typeof ticket.toObject === 'function' ? ticket.toObject() : ticket) : null;
