# PowerShell script to install DeCicco & Sons code signing certificate
# Installs to current user's certificate store (no admin privileges required)

param(
    [Parameter(Mandatory=$true)]
    [string]$CertificatePath
)

if (-not (Test-Path $CertificatePath)) {
    Write-Error "Certificate file not found: $CertificatePath"
    exit 1
}

Write-Host "Installing DeCicco & Sons code signing certificate for current user..." -ForegroundColor Green
Write-Host "No administrator privileges required." -ForegroundColor Yellow

try {
    # Install certificate to Current User's Trusted Publishers (allows automatic installation)
    Import-Certificate -FilePath $CertificatePath -CertStoreLocation 'Cert:\CurrentUser\TrustedPublisher' -Verbose
    
    # Install certificate to Current User's Trusted Root (establishes trust)
    Import-Certificate -FilePath $CertificatePath -CertStoreLocation 'Cert:\CurrentUser\Root' -Verbose
    
    Write-Host "Certificate installed successfully for current user!" -ForegroundColor Green
    Write-Host "This user account will now trust DeCicco & Sons signed applications." -ForegroundColor Yellow
    
} catch {
    Write-Error "Failed to install certificate: $($_.Exception.Message)"
    exit 1
}

Write-Host ""
Write-Host "Installation complete. The Bills Utility app updates will now install without warnings." -ForegroundColor Cyan 