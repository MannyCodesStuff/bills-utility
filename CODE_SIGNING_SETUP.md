# Code Signing Setup for Bills Utility

This guide walks you through setting up code signing for the Bills Utility app using a self-signed certificate.

## Step 1: Create the Code Signing Certificate

1. Open PowerShell as **Administrator**
2. Run the certificate creation script:
   ```powershell
   .\create-certificate.ps1
   ```
3. When prompted, enter a strong password for the PFX file
4. Note down the certificate thumbprint displayed

## Step 2: Configure Environment Variables

Set these environment variables on your build machine:

```powershell
# Set the certificate file path
$env:CSC_LINK = ".\DeCiccoCodeSigning.pfx"

# Set the certificate password (use the password you entered in Step 1)
$env:CSC_KEY_PASSWORD = "YourPasswordHere"

# Optional: Set certificate thumbprint
$env:CSC_THUMBPRINT = "ThumbprintFromStep1"
```

To make these permanent, add them to your system environment variables.

## Step 3: Install Certificate on Company Computers

For each computer that will run the Bills Utility app:

1. Copy the `DeCiccoCodeSigning.cer` file to the computer
2. Open PowerShell as **Administrator**
3. Run the installation script:
   ```powershell
   .\install-certificate.ps1 -CertificatePath ".\DeCiccoCodeSigning.cer"
   ```

## Step 4: Build and Publish

Now you can build and publish signed versions:

```bash
# Build a signed version locally
npm run electron:build-win64

# Publish a signed version to GitHub
npm run electron:publish-win64
```

## What This Accomplishes

✅ **Eliminates signature verification errors** during auto-updates
✅ **Reduces Windows security warnings** for users
✅ **Enables automatic updates** without user intervention
✅ **Free solution** for internal company apps

## Troubleshooting

### Certificate Not Found Error
- Ensure the PFX file path in `CSC_LINK` is correct
- Check that `CSC_KEY_PASSWORD` matches the password used when creating the certificate

### Build Still Fails
- Verify PowerShell execution policy allows script execution
- Run PowerShell as Administrator when creating certificates
- Ensure Windows SDK is installed (comes with Visual Studio)

### Users Still See Warnings
- Verify the certificate was installed on their computer using `install-certificate.ps1`
- Check that the certificate is in both "Trusted Publishers" and "Trusted Root Certification Authorities"

## Security Notes

⚠️ **Keep the PFX file secure** - it contains your private key
⚠️ **Use a strong password** for the PFX file
⚠️ **Only install the .cer file** on user computers (not the .pfx file)
✅ **This approach is standard** for internal company applications

## Alternative: Professional Code Signing

For external distribution or enhanced security, consider purchasing an EV Code Signing Certificate:

- **DigiCert**: ~$474/year
- **Sectigo**: ~$314/year  
- **GlobalSign**: ~$399/year 