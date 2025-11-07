# CSE540-Blockchain-Based-Food-Supply-Chain-Provenance-System

# Blockchain-Based Food Supply Chain Provenance System

**Repository:** https://github.com/varung1303/CSE540-Blockchain-Based-Food-Supply-Chain-Provenance-System

## Description
This project is a prototype of a blockchain-based food supply chain provenance system. It demonstrates the core idea of recording product batches and key lifecycle events on a blockchain (Ethereum-compatible) so that stakeholders (farmers, distributors, retailers, regulators, and consumers) can verify the origin and movement of food items. The prototype focuses on:

- Role-based access control for participants.
- Recording product metadata and ownership transfers on-chain.
- Exposing a verification API for consumers/regulators.
- Using on-chain events to enable off-chain indexing and UI dashboards.

This repo contains:
- `contracts/FoodProvenance.sol` — Draft contract (interfaces, events, data model, implemented core functions).
The `FoodProvenance` smart contract keeps a transparent record of how food products move through the supply chain.  
It lets farmers register new product batches, distributors and retailers update status, and consumers verify a product’s history.  
The system uses blockchain to make the data secure and tamper-proof.  
Each product entry stores details like origin, current owner, and status.  
Smart contracts ensure that only authorized people (with specific roles) can make updates.  
This helps build trust, prevent fraud, and make the food journey visible from farm to table.

- `README.md` — (this file).
- `docs/` — Project Pitch as of now but will consist of other material later on. (TBD)

## Project goals (short)
- Provide transparent, tamper-evident provenance for food items.
- Allow quick trace-back in case of contamination/fraud.
- Provide a simple prototype good enough for demonstration, testing, and extension.

## Dependencies / Setup Instructions (draft)
1. Install Node.js (v14+ recommended).
2. Install Hardhat and project dev dependencies:
   ```bash
   npm init -y
   npm install --save-dev hardhat @nomiclabs/hardhat-ethers ethers
   npm install @openzeppelin/contracts
