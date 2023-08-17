# ibank-integrations

generate SSL self signed

1. Generate the Private Key (domain.key):
    `openssl genpkey -algorithm RSA -out domain.key`
2. Generate the Certificate Signing Request (CSR) using the private key
    `openssl req -new -key domain.key -out momointegration.csr`
3. Generate a Self-Signed Certificate (momointegration.crt) from the CSR:
    `openssl x509 -req -days 365 -in momointegration.csr -signkey domain.key -out momointegration.crt`