const TicketType = require("../types_Constants/TicketType");
const TicketServiceError = require("../../exceptions/TicketServiceError");
const {Max_Quantity_Of_Tickets} = require("../types_Constants/TicketPrices");
const {TicketPrices} = require("../types_Constants/TicketPrices");
const TicketTypeRequest = require("../models/TicketTypeRequest");

class TicketService {
    constructor(ticketPaymentService, seatReservationService) {
        this.ticketPaymentService = ticketPaymentService;
        this.seatReservationService = seatReservationService;
    }

    purchaseTickets(accountId, ...ticketTypeRequests) {
        try {
            this.#validateArguments(accountId, ticketTypeRequests);

            const {infants: totalInfantTickets, children: totalChildTickets, adults: totalAdultTickets}
                = this.#countDifferentTickets(ticketTypeRequests);

            this.#validateIfPurchaseIsPossible(totalAdultTickets, totalInfantTickets, totalChildTickets);

            const totalAmount =
                (totalAdultTickets * TicketPrices.ADULT) + (totalChildTickets * TicketPrices.CHILD);
            const totalSeatsToReserve = totalAdultTickets + totalChildTickets;

            this.ticketPaymentService.makePayment(accountId, totalAmount);
            this.seatReservationService.reserveSeat(accountId, totalSeatsToReserve);

        } catch (error) {
            throw error;
        }
    }

    #validateArguments(accountId, ticketTypeRequests) {
        if (!this.#isAccountValid(accountId))
            throw new TicketServiceError("Invalid account id. Account id must be a number greater than 0");

        if (!this.#areRequestsPresent(ticketTypeRequests))
            throw new TicketServiceError("No ticket requests provided");

        if (!this.#areRequestsValid(ticketTypeRequests))
            throw new TicketServiceError("Requests contains one or more invalid request(s)");
    }

    #isAccountValid = (accountId) => Number.isInteger(accountId) && accountId > 0;

    #areRequestsPresent = (requests) => requests.length > 0;

    #areRequestsValid = (requests) => requests.every(request => request instanceof TicketTypeRequest);

    #countDifferentTickets(ticketTypeRequests) {
        const ticketQuantity = {
            infants: 0,
            children: 0,
            adults: 0,
        };
        for (const request of ticketTypeRequests) {
            if (request.ticketType === TicketType.INFANT) ticketQuantity.infants += request.ticketQuantity;

            if (request.ticketType === TicketType.CHILD) ticketQuantity.children += request.ticketQuantity;

            if (request.ticketType === TicketType.ADULT) ticketQuantity.adults += request.ticketQuantity;
        }
        return ticketQuantity;
    }

    #validateIfPurchaseIsPossible(numberOfAdultTickets, numberOfInfantsTickets, numberOfChildTickets) {
        if ((numberOfAdultTickets + numberOfInfantsTickets + numberOfChildTickets) > Max_Quantity_Of_Tickets)
            throw new TicketServiceError(`Only a maximum of ${Max_Quantity_Of_Tickets} can be purchased at a time`);

        if (numberOfAdultTickets === 0)
            throw new TicketServiceError("At least one Adult ticket needs to be purchased");

        if (numberOfAdultTickets < numberOfInfantsTickets)
            throw new TicketServiceError("Infant tickets require at least equal number of Adult ticket(s)");
    }


}

module.exports = TicketService;