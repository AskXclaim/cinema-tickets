const TicketTypeRequestError = require('../../exceptions/TicketTypeRequestError');
const TicketType = require("../types_Constants/TicketType");

class TicketTypeRequest {
    #ticketType;
    #ticketQuantity;

    constructor(ticketType, ticketQuantity) {
        if (!this.#isTicketTypeValid(ticketType)) {
            throw new TicketTypeRequestError('Ticket type is required')
        }
        if (!this.#isTicketQuantityValid(ticketQuantity)) {
            throw new TicketTypeRequestError('Number of tickets must be a non-negative integer')
        }

        this.#ticketQuantity = ticketQuantity;
        this.#ticketType = ticketType;
    }

     get TicketQuantity() {
        return this.#ticketQuantity
    }
    get TicketType() {
        return this.#ticketQuantity
    }

    #isTicketTypeValid = (ticketType) =>
        !(!ticketType || (ticketType !== TicketType.INFANT || ticketType !== TicketType.CHILD
            || ticketType !== TicketType.ADULT));

    #isTicketQuantityValid = (ticketQuantity) =>
        !(!Number.isInteger(ticketQuantity) || ticketQuantity < 0);

}

module.exports = TicketTypeRequest;