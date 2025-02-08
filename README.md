<div align="center">
   <img src="src/assets/Pngs/logo-white.png" height="200">
</div>

# Chief Finance DEX Frontend

This repository contains the DEX Module of the Chief Finance Project. On this platform , Users can swap , add liquidity for any two tokens.

## Table of Contents

- [About](#about)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
  - [Development Instance](#development-instance)
  - [Production Instance](#production-instance)
- [Environment Variables](#environment-variables)
- [Development Workflow](#development-workflow)

## About

Chief Finance DEX Platform Allow users to swap between different tokens , add liquidity for any two tokens and remove the liquidity they have added. The platform operates on 14 chains , including Binance Testnet , Sepolia Testnet , Polygon Testnet , and others.

## Prerequisites

Ensure you have the following installed:

- Node.js : `^18.20.3` [Download and Install](https://nodejs.org/en/download/package-manager)
- npm: Comes with Node.js, but ensure you are using the latest version.

For production hosting:

- Serve package (for serving the production build) : [npm registry](https://www.npmjs.com/package/serve)

## Installation

1. Clone the repository

   ```shell
   $ git clone https://github.com/Minddeft-internal/chief-finance-dex-frontend.git

   $ cd chief-finance-dex-frontend
   ```

2. Install the dependencies

   ```shell
   $ npm install
   ```

3. Set up environment variables:

   - Copy the content from `.env.example` into a new file `.env`.
   - Fill in the required environment variables.

## Running the Application

### Development Instance

Run the application on development mode:

shell
$ npm run start

This will start the app at `http://localhost:3000` by default.

### Production Instance

1. Create a build:

   ```shell
   $ npm run build
   ```

2. Install the serve package globally to host the production build:

   ```shell
   $ npm install -g serve
   ```

3. Serve the build:

   ```shell
   $ server -s build
   ```

The production build will be hosted on `http://localhost:3000`.

## Environment Variables

The app requires certain environment variables to function. After creating the `.env` file, ensure you have set all of the environment variables.

## Troubleshooting

- **Port Already in Use:** If the default port (3000) is in use, you can specify a new port by running:

  ```
  $ PORT=3001 npm run start
  ```

- **Failed to Install Dependencies:** Ensure that your node and npm versions match the requirements. You can update them with:

  ```
   $ npm install -g npm
  ```

## Development Guidelines

To maintain a structured development process, please follow the guidelines below:

1. Feature Branches

   - When starting work on a new feature or bugfix, create a new branch. If there is an associated Jira ticket, the branch name should match the Jira ticket ID.
   - Example:

   ```
   $ git checkout -b feature/JIRA-123
   ```

   - If there is no Jira ticket, use the following convention:

   ```
    $ git checkout -b feature/feature-name
   ```

2. Raising a Pull Request (PR)

   - After completing the feature or bugfix, push your branch to the remote repository
   - Open a pull request (PR) from your feature branch to the main branch.
   - Include in the PR description:
     - A reference to the Jira ticket (if applicable).
     - A brief summary of the feature or bugfix.

Following this workflow helps maintain consistency, traceability, and accountability in the development process.

## Note:

Add the below key-value pair in `scripts` in the `package.json` file, if not present.

```json
{
  "postinstall": "node ./scripts/post-install.js"
}
```
