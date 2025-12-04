CSE540-Blockchain-Based-Food-Supply-Chain-Provenance-System

  Repository: https://github.com/varung1303/CSE540-Blockchain-Based-Food-Supply-Chain-Provenance-System

  ---
  Description of the Project

  This is a blockchain-based food supply chain traceability system built on Ethereum that provides end-to-end transparency and provenance tracking for food products
  from farm to consumer.

  What It Does

  The system records all key lifecycle events—stakeholder registration, raw material sourcing, product creation, ownership transfers, and consumer reviews—as immutable
   blockchain transactions. Multiple participants (Farmers, Manufacturers, Distributors, Retailers, Consumers) interact with smart contracts through a React/Web3.js
  frontend, creating a transparent audit trail that cannot be tampered with.

  Key Features

  - Stakeholder Management: Role-based registration and admin verification for farmers, manufacturers, and retailers
  - Product Traceability: Complete tracking from raw materials to finished products with transaction history
  - Renewable Energy Verification: Immutable on-chain sustainability credentials for manufacturers promoting eco-friendly practices
  - Real-Time Analytics Dashboard: Supply chain intelligence including product freshness monitoring, transaction metrics, and sustainability tracking—all using
  gas-free blockchain queries
  - Review System: Consumer ratings and feedback tied to blockchain ownership
  - Modern UI: React-based interface with purple/blue gradient design and MetaMask wallet integration

  ---
  Project Goals

  1. Transparency: Provide tamper-evident, verifiable provenance for food products
  2. Trust: Enable stakeholder verification and create a chain of trust
  3. Traceability: Allow rapid trace-back in contamination or fraud cases
  4. Sustainability: Verify and promote renewable energy usage in manufacturing
  5. Intelligence: Provide real-time supply chain analytics without centralized systems

  ---


  Technology Stack

  - Smart Contracts: Solidity 0.8.0, Truffle v5.11.5
  - Blockchain: Ethereum (Ganache for development)
  - Frontend: React 17, Web3.js, Reactstrap
  - Wallet: MetaMask integration

  ---
  Dependencies or Setup Instructions

  Prerequisites

  Install the following before starting:

  - Node.js v18.20.8+ and npm v10.8.2+ - https://nodejs.org/
  - Truffle v5.11.5+ - npm install -g truffle
  - Ganache - https://trufflesuite.com/ganache/ (GUI) or npm install -g ganache (CLI)
  - MetaMask browser extension - https://metamask.io
  - Git - https://git-scm.com/

  Installation

  1. Clone the repository
  git clone https://github.com/varung1303/CSE540-Blockchain-Based-Food-Supply-Chain-Provenance-System.git
  cd CSE540-Blockchain-Based-Food-Supply-Chain-Provenance-System

  2. Install dependencies
  npm install

  3. Start Ganache
  - Open Ganache application and click "QUICKSTART"
  - OR run: ganache --deterministic --accounts 10 --port 7545

  4. Deploy smart contracts
  cd src/Smart-Contract
  npx truffle compile
  npx truffle migrate --reset --network development
  cd ../..

  5. Configure MetaMask
  - Add custom network in MetaMask:
    - Network Name: Ganache Local
    - RPC URL: http://127.0.0.1:7545
    - Chain ID: 1337
    - Currency Symbol: ETH
  - Import Ganache accounts using private keys (at least 4 accounts for different roles)

  6. Start the application
  npm start

  Application opens at http://localhost:3000

  ---
  How to Use or Deploy Source Code

  Using the Application

  Basic Workflow:

  1. Admin (Account 0): Automatically assigned when you connect with the first Ganache account
    - Verify farmers and manufacturers through admin panel
  2. Register as Farmer (Account 1):
    - Click "Register" → Select "Farmer" role
    - Enter name and location → Submit
    - Add raw products (e.g., "Organic Wheat", "Fresh Tomatoes")
  3. Register as Manufacturer (Account 2):
    - Register as "Manufacturer" role
    - Get admin verification (including optional renewable energy verification)
    - Source raw materials from verified farmers
    - Launch finished products with ingredient traceability
  4. Transfer Products:
    - View products on Products page
    - Transfer ownership to other accounts (retailers, distributors)
    - All transfers recorded on blockchain
  5. View Analytics:
    - Dashboard shows real-time statistics
    - Track fresh/expired products, transactions, eco-friendly products

  Deploying Source Code

  Local Development (Current Setup):
  - Already configured for Ganache local blockchain
  - Network: http://127.0.0.1:7545, Chain ID: 1337
