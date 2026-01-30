class TicketServiceError extends Error {
    constructor(message) {
        super(message);
        this.name = 'TicketServiceError';
    }
}

module.exports = TicketServiceError;