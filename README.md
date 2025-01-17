# Lost and Found

A web application for reporting and tracking lost and found items within a community. Users can post lost or found items and filter based on their college or location. The application uses MongoDB for data storage and Node.js with Express for the backend.

## Features

- User Authentication: Users can sign up, log in, and manage their profile.
- Post Lost and Found Items: Users can report items they've found or lost.
- Search Functionality: Users can search for items based on keywords.
- Filter by College: Users can see items relevant to their college.
- JWT Authentication: JSON Web Tokens are used to securely manage user sessions.

## Tech Stack

- Frontend: HTML, CSS, JavaScript
- Backend: Node.js, Express
- Database: MongoDB
- Authentication: JWT (JSON Web Tokens)

### Prerequisites

- Node.js
- MongoDB or MongoDB Atlas for cloud storage
- npm

### Steps to Run Locally

1. Clone the repository:
2. Install dependencies:
3. Create a `.env` file in the root directory of the project with the following content:

JWT_SECRET=your_secret_key_here 

MONGO_URI=mongodb+srv:< username>:< password> @cluster0mongodb.net/lost_and_found?retryWrites=true&w=majority

4. Start the server:

This will start the server on `http:/localhost:3000`.

## Acknowledgements

- Express
- MongoDB
- JWT
- Node.js
