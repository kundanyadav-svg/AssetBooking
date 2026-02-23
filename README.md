# AssetBooking


AssetFlow - Enterprise Asset & Seat Booking System
AssetFlow is a full-stack corporate management application designed to streamline workplace intelligence. It provides a robust platform for managing office seat reservations and hardware asset lifecycles, featuring specialized portals for Administrators, Employees, and IT Support.



****Features*****


 ****Seat Booking Management*****
 
Interactive Seat Map: Visual grid (1-30 seats by default) with real-time availability status for any selected date.

Dynamic Capacity: Administrators can configure the total number of available seats for specific dates.

Smart Constraints: Prevents double-booking of the same seat and restricts users to one booking per day.



****Asset Lifecycle Tracking****

Inventory Management: Administrators can add, update, or delete hardware assets with unique serial numbers.

Request Workflow: Employees can request new assets or report existing gear as "Broken".

Automated System Requests: Marking an asset as broken automatically generates an IT support request for replacement.

Assignment Tracking: Tracks which user currently holds which asset and its operational status.




*****Security & Access Control*****

JWT Authentication: Secure stateless authentication using JSON Web Tokens stored in HTTP-only cookies.

Role-Based Access Control (RBAC):

ADMIN: User registration, inventory control, and seat capacity management.

ITSUPPORT: Request desk management and status updates (Approve/Assign/Reject).

EMPLOYEE: Personal asset portal and seat reservation dashboard.




****Tech Stack****

Backend (Spring Boot)
Java 17 & Spring Boot.

Spring Security: JWT-based security and password encryption with BCrypt.

Spring Data JPA: Database interaction with Hibernate.

Database: Relational database with unique constraints for data integrity.





*****Frontend (React)***

Vite: Modern build tool for fast development.

Tailwind CSS: Utility-first styling with a custom enterprise theme.

Redux Toolkit: Centralized state management for user sessions.

React Router: Client-side routing for seamless navigation.

Lucide React: High-quality icon set for the UI.






*****Project Structure*****

Backend Modules
controller/: REST endpoints for Auth, Assets, Bookings, and Requests.

entity/: JPA entities representing the core domain models.

repositry/: Data access layers for interacting with the database.

services/: Business logic implementations for booking rules and asset workflows.

Security/: JWT utility classes and authentication filters.


Frontend Modules
src/Pages/: View components for the Dashboard, Asset Portal, and Request Desk.

src/Componenet/: Shared UI elements like the Sidebar and Navbar.

src/redux/: Global state management for user profiles.

src/Hooks/: Custom hooks for fetching user profiles on application load.




***Database Schema***

The system uses the following relational table structures:


1. Users (users)
Stores employee information and system credentials.

id: Primary Key (BigInt)

name: String

email: String (Unique, used for login)

password: String (BCrypt encoded)

role: String (ADMIN, EMPLOYEE, ITSUPPORT)

dept: String



2. Assets (assets)
Tracks the hardware inventory available for assignment.

id: Primary Key (BigInt)

serial: String (Unique hardware ID)

name: String

status: String (AVAILABLE, BOOKED, BROKEN, UNAVAILABLE)

quantity: Integer



3. Bookings (bookings)
Records office seat reservations.

id: Primary Key (BigInt)

seat_no: Integer

date: LocalDate

user_id: Foreign Key to users

Constraints: Unique combination of (user_id, date) and (seat_no, date).



4. Asset Assignments (asset_assignments)
Maps specific assets to users.

id: Primary Key (BigInt)

asset_id: Foreign Key to assets

user_id: Foreign Key to users

status: String (ASSIGNED, BROKEN, RETURNED)

assignedDate: LocalDate



5. Requests (requests)
Manages the workflow for new asset procurement or repairs.

id: Primary Key (BigInt)

item: String

requestStatus: String (DRAFT, PENDING, APPROVE, ASSIGNE, REJECTE)

requestType: String (USER_REQUEST, SYSTEM_GENERATED)

user_id: Foreign Key to users

asset_id: Foreign Key to assets (Nullable)



6. Seat Capacity (seat_capacity)
Defines the total seats available per day.

id: Primary Key (BigInt)

date: LocalDate (Unique)

totalSeats: Integer




***API Reference & URLs***

Authentication
Login: POST http://localhost:8080/auth/login

Register: POST http://localhost:8080/auth/register

Profile: GET http://localhost:8080/auth/profile

Logout: POST http://localhost:8080/auth/logout

Asset Management
Fetch All: GET http://localhost:8080/api/assets/all

Add Asset: POST http://localhost:8080/api/assets/add

Update Status: POST http://localhost:8080/api/assets/update-status/{id}

My Assignments: GET http://localhost:8080/api/my-assignments

Booking & Seats
Seat Status: GET http://localhost:8080/api/bookings/status?date={date}

Book Seat: POST http://localhost:8080/api/bookings/book

Set Capacity: PUT http://localhost:8080/api/seats

Requests
Create Request: POST http://localhost:8080/api/requests/create

All Requests (Admin/IT): GET http://localhost:8080/api/requests/all

Update Request Status: PUT http://localhost:8080/api/requests/{id}/status
