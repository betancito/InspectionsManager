# Inspection Management System - Frontend (Local Setup)

This document explains how to set up and run the Inspection Management System frontend locally.

## Prerequisites

- **Node.js:** v16 or higher (recommended)
- **npm:** Comes with Node.js (or use Yarn as your package manager)

## Setup Instructions

1. **Install the dependencies**

```bash
  npm install
  or
  yarn install
```

2. **Configure Enviorment variables**  
if you notice, in the root folder there is a file called `.env.example` if you wanted you can just dupplicate it into the .env since it contains the URL to the backend project but if for some reason it is running on a different port or URL feel free to edit it, the variable is called `VITE_API_URL`
```bash
  cp .env.example .env
```

3. **Run the development server**
```bash
  npm run dev
  or
  yarn dev
```
The frontend application should now be accessible in your browser at the URL that typically is http://localhost:5173/.

## Additional Information

- **Authentication**  
In case you didn´t noticed the test users in the other documentation i'm going to leave them here as well.

    `Admin user:`  
username: admin  
password: supersecret123

    `Inspector user:`  
username: inspector  
password: supersecret123

    `Analyst user:`  
username: analyst  
password: supersecret123

    `Viewer user:`  
username: viewer  
password: supersecret123