# MERN Space Pizza Auth Service

Welcome to the MERN Space Pizza Auth Service! This service is an essential component of the Space Pizza project, providing secure authentication and authorization functionalities. Built using Express, TypeScript, TypeORM, and PostgreSQL, it ensures your pizza orders and space adventures are protected😉.

## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)

## Features

1. **Winston Logger:** The service includes a powerful Winston logger for comprehensive log management, making it easy to track and debug any issues.

2. **Error Handler:** We've implemented an error handler to ensure graceful handling of errors, providing clear and meaningful error messages to users and developers alike.

3. **Role-Based Authentication:** Customize user roles to control access to various parts of your Space Pizza application. Admins, customers, and astronauts can enjoy tailored experiences.

4. **Token Mechanism:** The service utilizes a refresh token and access token mechanism for secure user authentication, ensuring that only authorized users can access your pizza and space adventures.

## Getting Started

To get started with the MERN Space Pizza Auth Service, follow these steps:

### Prerequisites

Before you begin, ensure you have the following installed on your system:

- [Node.js](https://nodejs.org/)
- [PostgreSQL](https://www.postgresql.org/) database
- [Bun](https://bun.sh/) (as the package manager)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/shivamvijaywargi/mernspace-auth-service.git
   ```

2. Navigate to the project directory:

   ```bash
   cd mernspace-auth-service
   ```

3. Install the dependencies using Bun:

   ```bash
   bun i
   ```

4. Configure the environment variables (see [Configuration](#configuration)).

5. Run the service:

   ```bash
   bun dev:bun
   ```

Now your MERN Space Pizza Auth Service is up and running!

---

Enjoy your journey through the cosmos with MERN Space Pizza Auth Service! 🚀🍕
