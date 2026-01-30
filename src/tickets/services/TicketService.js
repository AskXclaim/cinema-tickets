const TicketType = require("../types_Constants/TicketType");
const TicketServiceError = require("../../exceptions/TicketServiceError");
const {Max_Quantity_Of_Tickets} = require("../types_Constants/TicketPrices");
const {TicketPrices} = require("../types_Constants/TicketPrices");

class TicketService {
    constructor(ticketPaymentService, seatReservationService) {
        this.ticketPaymentService = ticketPaymentService;
        this.seatReservationService = seatReservationService;
    }

    purchaseTickets(accountId, ...ticketTypeRequests) {
        this.#validateParameters(accountId, ticketTypeRequests);

        const {numberOfInfants,numberOfChildren,numberOfAdults} = this.#countDifferentTickets(ticketTypeRequests);

        this.#validateIfPurchaseIsPossible(numberOfAdults,numberOfInfants);

        const totalAmount =
            (numberOfAdults * TicketPrices.ADULT) + (numberOfChildren * TicketPrices.CHILD);
        const totalSeatsToReserve = numberOfAdults + numberOfChildren;

        this.ticketPaymentService.makePayment(accountId, totalAmount);
        this.seatReservationService.reserveSeat(accountId, totalSeatsToReserve);
    }

    #validateIfPurchaseIsPossible(numberOfAdults,numberOfInfants) {
        if (numberOfAdults === 0)
            throw new TicketServiceError("At least one Adult ticket needs to be purchased");

        if (numberOfAdults < numberOfInfants)
            throw new TicketServiceError("Infant tickets require at least equal number of Adult ticket(s)");
    }

    #validateParameters(accountId, ticketTypeRequests) {
        if (!this.#isAccountValid(accountId))
            throw new TicketServiceError("Invalid account id. Account id must be a number greater than 0");

        if (!this.#areRequestsPresent(ticketTypeRequests))
            throw new TicketServiceError("No ticket requests provided");

        if (ticketTypeRequests.length > Max_Quantity_Of_Tickets)
            throw new TicketServiceError(`Only a maximum ${Max_Quantity_Of_Tickets} can be purchased at a time`);

        if (!this.#areRequestsValid(ticketTypeRequests))
            throw new TicketServiceError("Requests contains one or more invalid request(s)");
    }

    #isAccountValid = (accountId) => !(!accountId || typeof accountId !== "number" || accountId <= 0);

    #areRequestsPresent = (requests) =>
        !(!requests || !Array.isArray(requests) || requests.length === 0);

    #areRequestsValid(requests) {
        for (const request of requests) {
            if (!Object.hasOwn(request, "TicketType") || !Object.hasOwn(request, "TicketQuantity"))
                return false;
        }
        return true;
    }

    #countDifferentTickets(ticketTypeRequests) {
        let numberOfInfants = 0, numberOfChildren = 0, numberOfAdults = 0;
        for (const request of ticketTypeRequests) {
            if (request.TicketType === TicketType.INFANT) numberOfInfants += 1;

            if (request.TicketType === TicketType.CHILD) numberOfChildren += 1;

            if (request.TicketType === TicketType.ADULT) numberOfAdults += 1;
        }
        return {
            infants: numberOfInfants,
            children: numberOfChildren,
            adults: numberOfAdults
        };
    }
}

module.exports = TicketService;