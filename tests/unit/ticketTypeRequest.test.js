const {describe, expect} = require("@jest/globals");
const TicketTypeRequest = require("../../src/tickets/models/TicketTypeRequest");
const TicketType = require("../../src/tickets/types_Constants/TicketType");
const TicketTypeRequestError = require("../../src/exceptions/TicketTypeRequestError");

describe("TicketTypeRequest Constructor Parameter validation", () => {

    it("should throw an error when invalid quantity parameter is provided but valid ticket type parameter is provided", () => {
        expect(() => {
            new TicketTypeRequest(TicketType.INFANT, 0);
        }).toThrow(TicketTypeRequestError);
        expect(() => {
            new TicketTypeRequest(TicketType.CHILD, -1);
        }).toThrow(TicketTypeRequestError);
    });

    it("should throw an error when valid quantity parameter provided but invalid ticket type parameter is provided", () => {
        expect(() => {
            new TicketTypeRequest("invalid ticket type", 1);
        }).toThrow(TicketTypeRequestError);
    });

    it("should throw an error when valid quantity parameter provided but invalid ticket type parameter is provided", () => {
        expect(() => {
            new TicketTypeRequest(TicketType.ADULT, 1);
        }).not.toThrow();
    });
});