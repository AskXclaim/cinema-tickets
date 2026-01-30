const {expect, describe, it, beforeEach} = require("@jest/globals");
const TicketServiceError = require("../../src/exceptions/TicketServiceError");
const TicketService = require("../../src/tickets/services/TicketService");
const MockTicketPaymentService = require("../mocks/MockTicketPaymentService");
const MockSeatReservationService = require("../mocks/MockSeatReservationService");
const TicketTypeRequest = require("../../src/tickets/models/TicketTypeRequest");
const TicketType = require("../../src/tickets/types_Constants/TicketType");
const {Max_Quantity_Of_Tickets} = require("../../src/tickets/types_Constants/TicketPrices");

let mockTicketPaymentService = null;
let mockSeatReservationService = null;
let ticketService = null;
describe("TicketService.purchaseTickets", () => {
    beforeEach(() => {
        mockTicketPaymentService = new MockTicketPaymentService();
        mockSeatReservationService = new MockSeatReservationService();
        ticketService = new TicketService(mockTicketPaymentService, mockSeatReservationService);
    });

    it("should throw an error if account id is invalid",  () => {
        const requests = [new TicketTypeRequest(TicketType.ADULT, 1), new TicketTypeRequest(TicketType.CHILD, 1)];
         expect(() => ticketService.purchaseTickets(-1, requests)).toThrow();
         expect(() => ticketService.purchaseTickets(0, requests)).toThrow();
         expect(() => ticketService.purchaseTickets("1", requests)).toThrow();
         expect(() => ticketService.purchaseTickets(null, requests)).toThrow();
    });

    it("should throw an error if request is invalid",  () => {
         expect(() => ticketService.purchaseTickets(1)).toThrow(TicketServiceError);
         expect(() => ticketService.purchaseTickets(1,
            ...[new TicketTypeRequest(TicketType.ADULT, 1), {
                ticketType: () => {
                }
            }, {
                ticketQuantity: () => {
                }
            }]))
            .toThrow("invalid request(s)");
    });

    it(`should throw an error if total number of tickets exceed ${Max_Quantity_Of_Tickets}`,  () => {
         expect(() =>
            ticketService.purchaseTickets(1, ...[new TicketTypeRequest(TicketType.CHILD, 15),
                new TicketTypeRequest(TicketType.ADULT, 12)]))
            .toThrow(TicketServiceError);
         expect(() => ticketService.purchaseTickets(1, ...[new TicketTypeRequest(TicketType.INFANT, 15),
            new TicketTypeRequest(TicketType.ADULT, 12)]))
            .toThrow(TicketServiceError);
         expect(() => ticketService.purchaseTickets(1, ...[new TicketTypeRequest(TicketType.INFANT, 15),
            new TicketTypeRequest(TicketType.CHILD, 12)]))
            .toThrow(/maximum/i);
         expect(() =>
            ticketService.purchaseTickets(1, ...[new TicketTypeRequest(TicketType.CHILD, 12),
                new TicketTypeRequest(TicketType.INFANT, 6), new TicketTypeRequest(TicketType.ADULT, 12)]))
            .toThrow(/maximum/i);
    });


    it("should throw an error if request does not contain an adult ticket",  () => {
         expect(() => ticketService.purchaseTickets(1, ...[new TicketTypeRequest(TicketType.CHILD, 1),
            new TicketTypeRequest(TicketType.INFANT, 1)])).toThrow(TicketServiceError);
         expect(() => ticketService.purchaseTickets(1,
            ...[new TicketTypeRequest(TicketType.CHILD, 1)]))
            .toThrow(/At least one Adult ticket/);
         expect(() => ticketService.purchaseTickets(1,
            ...[new TicketTypeRequest(TicketType.INFANT, 1)]))
            .toThrow(/At least one Adult ticket/);
    });

    it("should throw an error if request contains less adult tickets to infant tickets",  () => {
         expect(() => ticketService.purchaseTickets(1, ...[new TicketTypeRequest(TicketType.CHILD, 1),
            new TicketTypeRequest(TicketType.INFANT, 10), new TicketTypeRequest(TicketType.ADULT, 9)]))
            .toThrow(TicketServiceError);
         expect(() => ticketService.purchaseTickets(1,
            ...[new TicketTypeRequest(TicketType.INFANT, 15), new TicketTypeRequest(TicketType.ADULT, 3)]))
            .toThrow(/equal number of Adult/);

    });

    it("should throw no error if request is valid and business rule are met",  () => {
         expect(() => ticketService.purchaseTickets(1, ...[new TicketTypeRequest(TicketType.CHILD, 1),
            new TicketTypeRequest(TicketType.INFANT, 1), new TicketTypeRequest(TicketType.ADULT, 1)]))
            .not.toThrow(TicketServiceError);
        expect(mockSeatReservationService.reserveSeat).toHaveBeenCalled();
        expect(mockTicketPaymentService.makePayment).toHaveBeenCalled();

         expect(() => ticketService.purchaseTickets(1, ...[new TicketTypeRequest(TicketType.CHILD, 1),
            new TicketTypeRequest(TicketType.ADULT, 1)]))
            .not.toThrow(TicketServiceError);
        expect(mockSeatReservationService.reserveSeat).toHaveBeenCalled();
        expect(mockTicketPaymentService.makePayment).toHaveBeenCalled();

         expect(() => ticketService.purchaseTickets(1, ...[new TicketTypeRequest(TicketType.INFANT, 1),
            new TicketTypeRequest(TicketType.ADULT, 1)]))
            .not.toThrow(TicketServiceError);
        expect(mockSeatReservationService.reserveSeat).toHaveBeenCalled();
        expect(mockTicketPaymentService.makePayment).toHaveBeenCalled();
    });
});