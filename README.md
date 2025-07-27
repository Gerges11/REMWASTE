# REMWASTE
Task Manager Web Application with Automated Testing
This repository contains a simple full-stack Task Manager web application, built with a React frontend and a Node.js backend API. More importantly, it demonstrates a comprehensive approach to automated testing, covering both Functional UI Automation and API Test Automation.

Project Structure
.
├── backend/
│   └── server.js               # Node.js Express API
├── frontend/
│   ├── public/
│   ├── src/
│   │   └── App.js              # React Frontend application
│   │   └── index.css           # Tailwind CSS setup
│   └── package.json
├── ui_tests/
│   └── (Java Selenium project) # Java Selenium UI automation scripts
├── api_tests/
│   └── task_manager_api_tests.json # (Placeholder) Postman Collection export
├── README.md                   # This file
└── TEST_PLAN.md                # Detailed Test Plan documentation

Technologies Used
Frontend: React.js, Tailwind CSS

Backend: Node.js, Express.js, JSON Web Tokens (JWT)

UI Automation: Selenium WebDriver (Java)

API Automation: Postman, Newman (Postman CLI)

Features
Task Manager Application
User Authentication (Login/Logout)

Create new tasks

View existing tasks

Edit task titles

Toggle task completion status

Delete tasks

Automated Testing
Functional UI Automation: End-to-end tests simulating user interactions on the React frontend, covering all key scenarios.

API Test Automation: Direct testing of backend API endpoints for functionality, data integrity, and error handling, covering all relevant positive and negative cases.

Setup and Running the Application
1. Backend Setup (Node.js)
Navigate to the backend directory: cd backend

Install Node.js dependencies: npm install express body-parser cors jsonwebtoken

Start the backend server: node server.js

The API will be running on http://localhost:3000.

Available Users: admin/admin (for testing purposes)

2. Frontend Setup (React)
Navigate to the frontend directory: cd frontend

Install React dependencies: npm install

(If setting up Tailwind CSS from scratch, also run npm install -D tailwindcss postcss autoprefixer and follow the Tailwind setup instructions.)

Start the React development server: npm start

The application will open in your browser, typically at http://localhost:3000.

Running Automated Tests
Ensure both the Backend and Frontend applications are running before executing any tests.

1. Functional UI Automation (Selenium)
These tests simulate a user interacting with the web application through a browser.

Prerequisites:

Java Development Kit (JDK) installed.

Selenium WebDriver libraries added to your Java project (e.g., via Maven or Gradle).

ChromeDriver: Download the appropriate version of ChromeDriver for your Google Chrome browser from https://chromedriver.chromium.org/downloads. Place the chromedriver executable in a directory that's included in your system's PATH environment variable.

How to Run:

Navigate to your Selenium Java project directory (e.g., ui_tests).

Compile and execute your tests using your preferred Java build tool or IDE.

A Chrome browser window will open, and you will observe automated interactions. Test results will be displayed in your console.

Covered Scenarios:

All functional UI scenarios, including login (valid/invalid), logout, task creation, editing, deletion, and completion toggling, along with data and message assertions.

2. API Test Automation (Postman/Newman)
These tests validate the backend API endpoints directly.

Prerequisites:

Postman Desktop App installed (https://www.postman.com/downloads/).

Newman (Postman CLI) installed globally: npm install -g newman

How to Set Up and Run:

Create Postman Collection:

Open Postman and create a new collection named "Task Manager API Tests".

In the collection's "Variables" tab, add baseUrl with value http://localhost:3001.

Add all necessary requests (e.g., POST /login, GET /items, PUT /items/:id, DELETE /items/:id) as detailed in the TEST_PLAN.md document (Section 4.3), configuring their methods, URLs, headers, bodies, and Tests scripts.

Ensure to run the POST /login and POST /items (positive) requests at least once in Postman to populate the authToken and createdTaskId environment variables, which are crucial for subsequent requests.

Export Collection:

Once all requests are configured, click the "..." next to your collection name in Postman and select "Export". Choose "Collection v2.1 (recommended)" and save it as task_manager_api_tests.json in the api_tests directory.

Run with Newman:

Navigate to the api_tests directory: cd api_tests

Execute Newman: newman run task_manager_api_tests.json

Newman will run all tests in the collection and provide a summary report in your terminal.

Covered Scenarios:

All API endpoints are tested, including authentication and task CRUD operations, with a focus on both positive and negative test cases and authorization checks.

Test Plan / Documentation
A detailed test plan outlining the scope, test coverage areas, tools used, and instructions on how to run the tests, along with assumptions and limitations, can be found in TEST_PLAN.md.

Conclusion
This project serves as a practical demonstration of building a small web application and implementing robust automated testing strategies for both its user interface and backend API. By combining Selenium for UI tests and Postman/Newman for API tests, a comprehensive testing suite ensures the application's functionality and reliability.
