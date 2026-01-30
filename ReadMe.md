# Ticket Service implementation
This project contains an implementation of a [cinema] Ticket service.
## Things to be aware of
This project contains an implementation of a Ticket service based on the following assumption:
- All accounts with an id greater than zero are valid. They also have sufficient funds to pay for any no of tickets.
- The `TicketPaymentService` implementation is an external provider with no defects. You do not need to worry about how the actual payment happens.
- The payment will always go through once a payment request has been made to the `TicketPaymentService`.
- The `SeatReservationService` implementation is an external provider with no defects. You do not need to worry about how the seat reservation algorithm works.
- The seat will always be reserved once a reservation request has been made to the `SeatReservationService`.

**Please note:  `TicketPaymentService` & `SeatReservationService` have not been supplied.**

### Running the application
Clone the project, and run `npm i` to install all packages used.
Use the command `npm test` to run the unit tests.

### Consideration:
- Node (JavaScript) was used though I would recommend using TypeScript if possible
- In this instance, validations were done without any npm packages though I would recommend using a package like joi
-  Making `TicketService` `purchaseTickets` method async would be what I would recommend but this may mean going against
the constraint 'The TicketService interface CANNOT be modified.'