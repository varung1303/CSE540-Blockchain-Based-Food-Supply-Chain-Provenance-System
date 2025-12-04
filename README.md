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

---
  How to Use 

  Quick Start Workflow

  The system supports multiple stakeholder roles. Here's a complete workflow from product creation to consumer verification:

  Step 1: Admin Setup (Account 0)

  The first Ganache account is automatically assigned as Admin.
  - Connect MetaMask with Account 0
  - Admin-only menu options will appear (Verify Farmer, Verify Manufacturer)

  Step 2: Farmer Registration (Account 1)

  1. Switch to Account 1 in MetaMask
  2. Click "Register" in navbar
  3. Select role: "Farmer"
  4. Enter name: "Green Valley Farms"
  5. Enter location: "California, USA"
  6. Click "Register" → Approve MetaMask transaction
  7. Navigate to Farmer profile
  8. Add raw products: "Organic Wheat", "Fresh Tomatoes"

  Step 3: Admin Verification

  1. Switch to Account 0 (Admin)
  2. Navigate to "Verify Farmer"
  3. Find "Green Valley Farms" card
  4. Click "Verify" → Approve transaction
  5. Status changes to "Verified" with green badge

  Step 4: Manufacturer Registration (Account 2)

  1. Switch to Account 2
  2. Register as "Manufacturer"
  3. Name: "Fresh Foods Co."
  4. Location: "Portland, Oregon"
  5. Admin verifies manufacturer (repeat Step 3)
  6. Admin can also verify renewable energy usage (sets "Eco-Friendly" badge)

  Step 5: Raw Material Sourcing

  1. As Manufacturer (Account 2), navigate to "Raw Products"
  2. Click "Add Raw Product"
  3. Search for "Organic Wheat"
  4. Select verified supplier "Green Valley Farms"
  5. Enter quantity: 1000
  6. Confirm transaction

  Step 6: Product Launch

  1. Click "Launched Products" → "Launch Product"
  2. Fill details:
     - Name: "Organic Pasta Sauce"
     - Description: "Premium sauce with organic ingredients"
     - Base Price: 12
     - Quantity: 100
     - Batch Number: BATCH-001
     - Manufacturing Date: (today)
     - Expiry Date: (1 year from today)
  3. Product is minted with automatic traceability to raw materials

  Step 7: Product Transfer

  1. Navigate to "Products" page
  2. Click on "Organic Pasta Sauce"
  3. View complete traceability (ingredients, origin, verification status)
  4. Enter receiver address (Account 3 from Ganache)
  5. Click "Transfer" → Confirm transaction

  Step 8: View Analytics Dashboard

  1. Navigate to Dashboard
  2. View real-time statistics:
     - Total Products: 1
     - Fresh Products: 1
     - Expired Products: 0
     - Unique Batches: 1
     - Eco-Friendly Products: 1 (if manufacturer is verified)
     - Transactions: 1
     - Reviews: 0

