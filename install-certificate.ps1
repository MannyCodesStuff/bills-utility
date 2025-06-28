# PowerShell script to install DeCicco & Sons code signing certificate
# Run this as Administrator on each company computer

param(
    [Parameter(Mandatory=$true)]
    [string]$CertificatePath
)

if (-NOT ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator"))
{
    Write-Error "This script must be run as Administrator"
    exit 1
}

if (-not (Test-Path $CertificatePath)) {
    Write-Error "Certificate file not found: $CertificatePath"
    exit 1
}

Write-Host "Installing DeCicco & Sons code signing certificate..." -ForegroundColor Green

try {
    # Install certificate to Trusted Publishers (allows automatic installation)
    Import-Certificate -FilePath $CertificatePath -CertStoreLocation 'Cert:\LocalMachine\TrustedPublisher' -Verbose
    
    # Install certificate to Trusted Root (establishes trust)
    Import-Certificate -FilePath $CertificatePath -CertStoreLocation 'Cert:\LocalMachine\Root' -Verbose
    
    Write-Host "Certificate installed successfully!" -ForegroundColor Green
    Write-Host "This computer will now trust DeCicco & Sons signed applications." -ForegroundColor Yellow
    
} catch {
    Write-Error "Failed to install certificate: $($_.Exception.Message)"
    exit 1
}

Write-Host ""
Write-Host "Installation complete. The Bills Utility app updates will now install without warnings." -ForegroundColor Cyan 