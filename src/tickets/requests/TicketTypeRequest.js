const TicketTypeRequestError = require("../../exceptions/TicketTypeRequestError");
const TicketType = require("../types_Constants/TicketType");

class TicketTypeRequest {
    #ticketType;
    #ticketQuantity;

    constructor(ticketType, ticketQuantity) {
        if (!this.#isTicketTypeValid(ticketType)) {
            throw new TicketTypeRequestError("A valid Ticket type is required");
        }
        if (!this.#isTicketQuantityValid(ticketQuantity)) {
            throw new TicketTypeRequestError("Number of tickets must be a non-negative integer");
        }

        this.#ticketQuantity = ticketQuantity;
        this.#ticketType = ticketType;
    }

    get ticketQuantity() {
        return this.#ticketQuantity;
    }

    get ticketType() {
        return this.#ticketType;
    }

    #isTicketTypeValid = (ticketType) => Object.values(TicketType).includes(ticketType);

    #isTicketQuantityValid = (ticketQuantity) =>
        Number.isInteger(ticketQuantity) && ticketQuantity > 0;
}

module.exports = TicketTypeRequest;