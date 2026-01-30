class TicketTypeRequestError extends Error {
    constructor(message) {
        super(message);
        this.name = 'TicketTypeRequestError';
    }
}

module.exports = TicketTypeRequestError;