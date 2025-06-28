# PowerShell script to create a self-signed code signing certificate
# Run this as Administrator

# Certificate details
$certName = "DeCicco & Sons"
$certSubject = "CN=DeCicco & Sons, O=DeCicco & Sons, C=US"

Write-Host "Creating self-signed code signing certificate..." -ForegroundColor Green

# Create the certificate
$cert = New-SelfSignedCertificate `
    -Subject $certSubject `
    -Type CodeSigningCert `
    -KeyUsage DigitalSignature `
    -FriendlyName "DeCicco & Sons Code Signing" `
    -CertStoreLocation "Cert:\CurrentUser\My" `
    -KeyExportPolicy Exportable `
    -KeySpec Signature `
    -KeyLength 2048 `
    -KeyAlgorithm RSA `
    -HashAlgorithm SHA256

Write-Host "Certificate created successfully!" -ForegroundColor Green
Write-Host "Thumbprint: $($cert.Thumbprint)" -ForegroundColor Yellow

# Export certificate to file for distribution
$certPath = ".\DeCiccoCodeSigning.cer"
Export-Certificate -Cert $cert -FilePath $certPath -Type CERT

Write-Host "Certificate exported to: $certPath" -ForegroundColor Yellow

# Export private key for signing (password protected)
$pfxPath = ".\DeCiccoCodeSigning.pfx"
$password = Read-Host "Enter password for PFX file" -AsSecureString
Export-PfxCertificate -Cert $cert -FilePath $pfxPath -Password $password

Write-Host "Private key exported to: $pfxPath" -ForegroundColor Yellow

Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Install the certificate on all company computers that will run the app"
Write-Host "2. Add the certificate thumbprint to your package.json"
Write-Host "3. Set the CSC_KEY_PASSWORD environment variable"
Write-Host ""
Write-Host "Certificate thumbprint to add to package.json:" -ForegroundColor Green
Write-Host $cert.Thumbprint

# Instructions for installing on company computers
Write-Host ""
Write-Host "To install on company computers, run as Administrator:" -ForegroundColor Cyan
Write-Host "Import-Certificate -FilePath '$certPath' -CertStoreLocation 'Cert:\LocalMachine\TrustedPublisher'"
Write-Host "Import-Certificate -FilePath '$certPath' -CertStoreLocation 'Cert:\LocalMachine\Root'" 