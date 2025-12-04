import json

# New contract addresses from the deployment
contracts = {
    "Farmer.json": "0x207F3fCc03cEeF8a8DCD4b41862F685A02c085C2",
    "Manufacturer.json": "0x94eB76e52Bc119cF6aeE920425A308A34e1cA3DB",
    "Stakeholder.json": "0x8b8cfe2A33ac8e75e2F48F0E77361bb97d02fb56",
    "Product.json": "0xf80b3a1A4f80f8754082beeA25a8702332cC05BC",
    "Main.json": "0x3F5C20e345613BBE5621a410B42a39c2BCB1C75e"
}

network_id = "5777"

for filename, address in contracts.items():
    filepath = f"ABI/{filename}"

    with open(filepath, 'r') as f:
        data = json.load(f)

    # Update network data
    data["networks"][network_id] = {
        "events": {},
        "links": {},
        "address": address,
        "transactionHash": "0x0000000000000000000000000000000000000000000000000000000000000000"
    }

    with open(filepath, 'w') as f:
        json.dump(data, f, indent=2)

    print(f"Updated {filename} with address {address}")

print("All ABI files updated successfully!")
