// start project
- npm install
- node server.js

// example curl
curl --location 'http://localhost:3000/bridge' \
--header 'Content-Type: application/json' \
--data '{
    "wallet_address":"0x7b275c979AefF71585F983B8f2FC356C487396E2",
    "source":"Fantom",
    "destination":"Avalance",
    "amount":100000000
}'