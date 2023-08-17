#!/bin/bash

# Create a self-signed SSL certificate and private key
openssl genpkey -algorithm RSA -out domain.key
openssl req -new -key domain.key -out all.csr -subj "/C=RW/ST=Kigali/L=Kigali/O=Development Bank of Rwanda/OU=Digital Inovation/CN=Development Bank of Rwanda"
openssl x509 -req -days 365 -in all.csr -signkey domain.key -out all.crt

echo "SSL self-signed certificates have been generated successfully."
