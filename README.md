# Zomato Restaurant Listing & Searching

This project allows users to search for restaurants based on location and cuisine, and view the results in a paginated list. The project uses MongoDB for data storage and includes a frontend UI built with React and styled using Tailwind CSS.

## Features

- **Restaurant Listing**: Displays a list of restaurants with pagination.
- **Search Functionality**: Allows users to filter restaurants by latitude, longitude, and cuisine.
- **Frontend UI**: Built with React, styled with Tailwind CSS.
- **Backend**: Uses MongoDB for storing restaurant data and serving API endpoints.

## Live Demo

Check out the live site here: [Zomato Restaurant Listing & Searching](https://restaurant-finder-tl1g.onrender.com/)

## Project Setup

### 1. Clone the repository:

```bash
git clone <repository-url> cd <project-directory>
```
### 2. Install dependencies:

- **Backend** (API, Express, MongoDB):
```bash
cd backend npm install
```


- **Frontend** (React, Tailwind CSS):
```bash
cd ../frontend npm install
```


### 3. Environment Variables

Make sure to configure the necessary environment variables for the backend. Create a `.env` file in the `backend` directory and add the following:

```bash
MONGO_URI=<your-mongodb-uri> PORT=5000
```

### 4. Start the project

- **Backend**:
```bash
cd backend npm start
```

- **Frontend**:
```bash
cd ../frontend npm run dev
```
