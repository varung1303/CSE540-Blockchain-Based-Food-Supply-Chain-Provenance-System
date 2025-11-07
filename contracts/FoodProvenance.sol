
pragma solidity ^0.8.19;

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/*
 * FoodProvenance Smart Contract
 * ------------------------------
 * This contract keeps track of food batches as they move through the supply chain.
 * Farmers register products on the blockchain with details like origin and metadata.
 * Distributors and retailers update product status as it moves from farm to market.
 * Regulators and consumers can view and verify the full history of each product.
 *
 * The goal is to make food tracking transparent, secure, and tamper-proof.
 * Every change is recorded on the blockchain and cannot be altered later.
 * The system uses roles to control who can register, transfer, or update data.
 *
 * This draft version shows the main functions, structures, and logic
 */


import "@openzeppelin/contracts/access/AccessControl.sol";

contract FoodProvenance is AccessControl {


    // Roles - define who does what
    bytes32 public constant FARMER_ROLE = keccak256("FARMER_ROLE");        // Farmer: registers food batches
    bytes32 public constant DISTRIBUTOR_ROLE = keccak256("DISTRIBUTOR_ROLE"); // Distributor: records transport updates
    bytes32 public constant RETAILER_ROLE = keccak256("RETAILER_ROLE");    // Retailer: confirms product receipt
    bytes32 public constant REGULATOR_ROLE = keccak256("REGULATOR_ROLE");  // Regulator: audits and verifies information


    // Enum for product status
    // This shows what stage the product is in the supply chain.
    enum Status { Created, InTransit, Received, Recalled, Invalid }

 
    // Struct to store product data
    struct Product {
        uint256 id;            // Unique ID for the batch or product
        address owner;         // Current owner (farmer, distributor, retailer)
        Status status;         // Current status (like Created, InTransit, etc)
        uint256 createdAt;     // Timestamp when the product was registered
        string origin;         // Where the product came from 
        string metadataURI;    // Link to extra data 
    }

    // Mappings to store product data
    mapping(uint256 => Product) private products;          // productId => product details
    mapping(uint256 => address[]) private productHistory;  // productId => list of owners
    mapping(uint256 => bool) private exists;               // productId => true/false if product exists


    // Events - to log important actions
    event ProductRegistered(uint256 indexed productId, address indexed farmer);
    event OwnershipTransferred(uint256 indexed productId, address indexed from, address indexed to);
    event StatusUpdated(uint256 indexed productId, Status newStatus, address indexed updatedBy);


    // checks if a product actually exists in the system.
    modifier onlyExisting(uint256 productId) {
        require(exists[productId], "Product does not exist");
        _;
    }

    // ensures only the product’s owner can perform certain actions.
    modifier onlyOwner(uint256 productId) {
        require(products[productId].owner == msg.sender, "Not the product owner");
        _;
    }

    
    constructor(address admin) {
        _setupRole(DEFAULT_ADMIN_ROLE, admin);
    }

    
    // This function lets the farmer add a new product batch to the blockchain.
    // It stores product details and emits an event for transparency.
    function registerProduct(
        uint256 productId,
        string calldata origin,
        string calldata metadataURI
    ) external {
        // Only a farmer can register a product
        require(hasRole(FARMER_ROLE, msg.sender), "Only farmer can register");

        // Make sure the product ID does not already exist
        require(!exists[productId], "Product already exists");

        // Create the product record
        products[productId] = Product({
            id: productId,
            owner: msg.sender,
            status: Status.Created,
            createdAt: block.timestamp,
            origin: origin,
            metadataURI: metadataURI
        });

        // Mark as existing and record first owner
        exists[productId] = true;
        productHistory[productId].push(msg.sender);

        // Emit event to let everyone know a product was registered
        emit ProductRegistered(productId, msg.sender);
    }

    
    // This lets the current owner (farmer, distributor, etc.) transfer the product to another address.
    // Each transfer is recorded for traceability.
    function transferOwnership(uint256 productId, address to)
        external
        onlyExisting(productId)
        onlyOwner(productId)
    {
        // New owner address must be valid
        require(to != address(0), "Invalid new owner");

        // Record ownership change
        address previousOwner = products[productId].owner;
        products[productId].owner = to;
        productHistory[productId].push(to);

        // Emit event to record this change
        emit OwnershipTransferred(productId, previousOwner, to);
    }

    
    // This lets authorized users (distributors, retailers, regulators) update product status.
    // Example: InTransit, Received, Recalled.
    function updateStatus(uint256 productId, Status newStatus)
        external
        onlyExisting(productId)
    {
        // Only specific roles or owner can update the status
        bool authorized = hasRole(DISTRIBUTOR_ROLE, msg.sender) ||
                          hasRole(RETAILER_ROLE, msg.sender) ||
                          hasRole(REGULATOR_ROLE, msg.sender) ||
                          hasRole(DEFAULT_ADMIN_ROLE, msg.sender) ||
                          msg.sender == products[productId].owner;

        require(authorized, "Not authorized to update status");

        // Update and emit event
        products[productId].status = newStatus;
        emit StatusUpdated(productId, newStatus, msg.sender);
    }

    
    // This lets anyone (like a consumer or regulator) check the product’s history and details.
    // It returns key info such as owner, origin, and past owners.
    function verifyProduct(uint256 productId)
        external
        view
        onlyExisting(productId)
        returns (
            uint256 id,
            address owner,
            Status status,
            uint256 createdAt,
            string memory origin,
            string memory metadataURI,
            address[] memory history
        )
    {
        Product storage p = products[productId];
        return (p.id, p.owner, p.status, p.createdAt, p.origin, p.metadataURI, productHistory[productId]);
    }

    
    // Returns the list of all owners who handled the product.
    function getHistory(uint256 productId)
        external
        view
        onlyExisting(productId)
        returns (address[] memory)
    {
        return productHistory[productId];
    }
    
    //to check if a product is registered or not.
    function existsProduct(uint256 productId)
        external
        view
        returns (bool)
    {
        return exists[productId];
    }
}
