---

# One-Click Ethereum Authentication

This repository contains a simple web application that demonstrates how to implement Ethereum-based authentication using React, Express.js, and MongoDB.

## Overview

The application consists of a client and a server. The client is a React application that provides a login button. When the user clicks this button, they are prompted to give the application access to their Ethereum accounts and to sign a message with their Ethereum account. The server is an Express.js application that connects to a MongoDB database and verifies the user's signed message.

## Installation

1. Clone the repository:

```bash
git clone https://github.com/ncryptster/one-click.git
```

2. Install the dependencies for the client and the server:

```bash
cd one-click/client
npm install

cd ../server
npm install
```

3. Create a `.env` file in the root of the 'server' directory with the following environment variables:

```bash
DB_URI=<your MongoDB connection string>
JWT_SECRET=<a secret key for signing JSON Web Tokens>
```

4. Create a `.env` file in the root of the 'client' directory with the following environment variable:

```bash
REACT_APP_SERVER_URL=http://localhost:3000
```

## Running the Application

1. Start the server:

```bash
cd one-click/server
npm start
```

2. In a new terminal window, start the client:

```bash
cd one-click/client
npm start
```

The client will be available at `http://localhost:3000` (or another port if you specified a different one in the `.env` file).

## Contributing

Contributions are welcome! Please create an issue to discuss your proposed changes or create a pull request.

---

