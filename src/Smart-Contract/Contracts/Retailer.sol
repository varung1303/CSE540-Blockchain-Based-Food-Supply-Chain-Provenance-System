// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import './Stakeholder.sol';

contract Retailer is Stakeholder {

  mapping(address => uint256[]) public _inventory;
  mapping(address => uint256) public _totalSales;

  constructor() Stakeholder() {}

  function register(
    string memory _name,
    string memory _location,
    string memory _role
  ) public override returns (bool) {
    require (_stakeholders[msg.sender].id ==  address(0), "Retailer::register: Retailer already registered");
    _stakeholders[msg.sender] = stakeholder(msg.sender, _name, _location, _role, false);
    _totalSales[msg.sender] = 0;
    _stakeholderAddresses.push(msg.sender);
    return true;
  }

  function addToInventory(uint256 _productId) public returns (bool) {
    _inventory[msg.sender].push(_productId);
    _stakeholderProductOwnership[msg.sender][_productId] = true;
    return true;
  }

  function recordSale(uint256 _productId) public returns (bool) {
    require(_stakeholderProductOwnership[msg.sender][_productId], "Retailer::recordSale: Not the owner");
    _totalSales[msg.sender]++;
    _stakeholderProductOwnership[msg.sender][_productId] = false;
    return true;
  }

  function getRetailer(address id) public view returns (
    stakeholder memory retailer,
    uint256[] memory inventory,
    uint256 totalSales
  ){
    retailer = stakeholder(id, _stakeholders[id].name, _stakeholders[id].location, _stakeholders[id].role, _stakeholders[id].isVerified);
    inventory = _inventory[id];
    totalSales = _totalSales[id];
  }

  function getInventory(address id) public view returns (uint256[] memory){
    return _inventory[id];
  }

  function getTotalSales(address id) public view returns (uint256){
    return _totalSales[id];
  }

}
