# CarPool - MERN Carpool Application

## Live Demo

You can view a live demo of the application at the following link:

[CarPool Live Demo](https://your-live-demo-link.com)

## Project Overview

A carpooling web application where users can act as passengers or drivers. The platform enables drivers to publish rides and passengers to search and book rides based on specific filters like origin, destination, journey date, and number of available seats. Features include live tracking, user profiles, emergency contact management, and more.

---

## Features

### Landing Page
- **Sign Up**: Redirects to the signup form.
- **Sign In**: Redirects to the signin form.

### Home Page
- **Search Rides**: Users can search for rides by entering origin, destination, journey date, and the number of seats. Place predictions are shown while typing.
- **Ride Cards**: Displays a list of available rides. Clicking a ride card shows ride details, driver information, vehicle details, and passenger details for safety.
- **Book Ride**: Redirects to the booking page.

### Booking Page
- Users can add passenger details (name, age, gender) and book multiple seats if available.
- Redirects to the "My Rides" page upon successful booking.

### My Rides Page
- Displays a list of rides (active, completed, canceled, or started) with statuses visible on each card.

### Ride Details Page
- **Passenger Actions**:
  - Active: Options to book, cancel, or update a booking.
  - Started: Access live tracking (via "Open Map") and send an SOS alert to emergency contacts.
  - Canceled/Completed: Displays ride status as "Canceled" or "Completed".
- **Driver Actions**:
  - Active: Options to cancel, update, or start the ride.
  - Started: Access live tracking and finish the ride.
  - Canceled/Completed: Displays ride status as "Canceled" or "Completed".

### Publish Ride
- Users can publish a ride by filling in details such as origin, destination, journey date, start time, total seats, and vehicle details.

### Profile Page
- View personal details and manage emergency contacts (add up to 2 contacts).
- Logout option available.

### Error Handling
- Alerts and popups are displayed for errors, such as token expiration, with a redirect to the signin page.

---

## Technologies Used

### Backend
- **Node.js**
- **Express.js**
- **MongoDB**
- **JWT (JSON Web Token)**
- **Bcrypt**
- **Google Maps API**
- **Socket.io**
- **Nodemailer**

### Frontend
- **React.js**
- **JavaScript**
- **Context API**
- **React Router**
- **Socket.io**

---

## API Endpoints
### User Features: `/api/users/`

- **POST /signup**  
  **Body**: `{name, email, password, mobile, age, gender}`  
  **Response**: Created user or error message.

- **POST /signin**  
  **Body**: `{email, password}`  
  **Response**: Signed in user or error message.

- **GET /** (User by ID)  
  **Response**: User details.

- **PUT /edit**  
  **Body**: `{user data}`  
  **Response**: Updated user.

### Ride Features: `/api/ride`

- **POST /**  
  **Body**: `{origin, originId, destination, destinationId, journeyDate, startTime, totalSeats, farePerPerson, vehicleName, vehicleColor, vehiclePlate}`  
  **Response**: Published ride.

- **PUT /updateStatus/:id**  
  **Body**: `{status}`  
  **Response**: Updated ride status.

- **GET /** (All rides of the particular user - Passenger or Driver)  
  **Response**: List of all rides.

- **GET /filter**  
  **Query**: `{origin, destination, date, noOfSeats}`  
  **Response**: List of filtered rides.

- **GET /emergency**  
  **Query**: `{rideId, lat, lng}`  
  **Response**: Success message.

### Booking Features: `/api/booking`

- **POST /**  
  **Body**: `{rideId, totalPassengers, allPassengers(name, age, gender)}`  
  **Response**: Created booking.

- **PUT /:id**  
  **Body**: `{rideId, totalPassengers, allPassengers(name, age, gender)}`  
  **Response**: Updated booking.

- **GET /:id**  
  **Response**: Booking details.

- **GET /** (Bookings of the particular user)  
  **Response**: List of bookings.

- **PUT /cancel/:id**  
  **Response**: Cancelled booking.

### Map Features: `/api/map`

- **GET /geocode**  
  **Query**: `place name`  
  **Response**: Geocodes of the place name.

- **GET /prediction**  
  **Query**: `input`  
  **Response**: List of predictions based on input.

- **GET /route-info**  
  **Query**: `{origin, destination}`  
  **Response**: `{origin_address, destination_address, distance, duration}`

- **GET /get-directions**  
  **Query**: `{origin, destination}`  
  **Response**: Directions between origin and destination.

---

## Project Setup

### Backend Setup
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd backend
2. Install dependencies:
   ```bash
   npm install
3. Create a .env file in the root of the backend directory and add the following environment variables:
   ```bash
   MONGODB_URI=<Your MongoDB URI>
   PORT=5000
   GOOGLE_MAPS_API_KEY=<Your Google Maps API Key>
   FRONTEND_URL=<Frontend URL>
   SENDER_EMAIL_ID=<Your Email>
   SENDER_EMAIL_PASS=<Your Email Password>
4. Start the backend server:
    ```bash
    node index.js
### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd backend
2. Install dependencies:
   ```bash
   npm install
3. Create a .env file in the root of the frontend directory and add the following environment variables:
   ```bash
   REACT_APP_BACKEND_URL=<Your Backend URL>
   REACT_APP_GOOGLE_MAPS_API_KEY=<Your Google Maps API Key>
4. Start the frontend server:
    ```bash
    npm start
## Usage

- After setting up both the frontend and backend, open the app in your browser.
- The user will see the landing page with options to sign up or sign in.
- After successful authentication, the user can search for rides, book rides, view their active rides, and track rides in real-time.

## Mobile Experience

This project is designed primarily for mobile users for an enhanced experience, especially when using the live tracking feature. For optimal performance, we recommend accessing the app on a mobile device.

## Error Handling

- If an error occurs, an alert popup will display.
- If the token expires or is unavailable, an error popup will appear, and the user will be redirected to the sign-in page.