# Custom NSIS installer script for Bills Utility
# Handles automatic certificate installation during app installation

!include "MUI2.nsh"
!include LogicLib.nsh
!include WinMessages.nsh
!include nsDialogs.nsh
!include FileFunc.nsh

# Insert FileFunc macros
!insertmacro GetParameters
!insertmacro GetOptions

# Function to check if user has admin privileges
Function IsAdmin
    ClearErrors
    UserInfo::GetName
    IfErrors Win9x
    Pop $0
    UserInfo::GetAccountType
    Pop $1
    ${If} $1 == "Admin"
        StrCpy $0 "true"
    ${Else}
        StrCpy $0 "false"
    ${EndIf}
    Goto done
    Win9x:
        StrCpy $0 "true"
    done:
    Push $0
FunctionEnd

# Function to check if certificate is already installed
Function IsCertificateInstalled
    DetailPrint "Checking if DeCicco certificate is already installed..."
    
    # More robust certificate checking with detailed output
    nsExec::ExecToLog 'powershell.exe -ExecutionPolicy Bypass -Command "try { $userCert = Get-ChildItem -Path Cert:\CurrentUser\TrustedPublisher -ErrorAction SilentlyContinue | Where-Object {$_.Subject -like \"*DeCicco*\"} | Select-Object -First 1; $machineCert = Get-ChildItem -Path Cert:\LocalMachine\TrustedPublisher -ErrorAction SilentlyContinue | Where-Object {$_.Subject -like \"*DeCicco*\"} | Select-Object -First 1; if ($userCert) { Write-Host \"Found DeCicco certificate in CurrentUser store\"; exit 0 } elseif ($machineCert) { Write-Host \"Found DeCicco certificate in LocalMachine store\"; exit 0 } else { Write-Host \"No DeCicco certificate found in any store\"; exit 1 } } catch { Write-Host \"Error checking certificates: $_\"; exit 2 }"'
    Pop $R9
    
    # $R9 = 0 means certificate found, $R9 = 1 means not found, $R9 = 2 means error
    DetailPrint "Certificate check result: $R9"
    Push $R9
FunctionEnd

# Function to install DeCicco certificate
Function InstallCertificate
    # Check if this is a silent installation (auto-update)
    # Auto-updates typically run with /S, /SILENT, or --updated flags
    ${GetParameters} $R8
    ClearErrors
    
    # Check for various silent installation flags
    ${GetOptions} $R8 "/S" $R7
    ${IfNot} ${Errors}
        StrCpy $R7 "true"   # Found /S flag
        Goto silent_detected
    ${EndIf}
    
    ${GetOptions} $R8 "/SILENT" $R7  
    ${IfNot} ${Errors}
        StrCpy $R7 "true"   # Found /SILENT flag
        Goto silent_detected
    ${EndIf}
    
    ${GetOptions} $R8 "--updated" $R7
    ${IfNot} ${Errors}
        StrCpy $R7 "true"   # Found --updated flag (electron-updater)
        Goto silent_detected
    ${EndIf}
    
    # No silent flags found - this is an interactive installation
    StrCpy $R7 "false"
    
    silent_detected:
    
    # Get installation directory
    StrCpy $R0 "$INSTDIR\resources\certificates\DeCiccoCodeSigning.cer"
    StrCpy $R1 "$INSTDIR\resources\certificates\install-certificate.ps1"
    
    # Check if certificate file exists
    ${If} ${FileExists} "$R0"
        # Check if certificate is already installed
        Call IsCertificateInstalled
        Pop $R9
        
        ${If} $R9 == 0
            DetailPrint "DeCicco certificate is already installed, skipping installation."
            # Silent operation - no dialog for "already installed" since user wants silent operation
            Goto cert_done
        ${ElseIf} $R9 == 2
            DetailPrint "Error occurred while checking certificate status."
            # Always show error dialogs for troubleshooting
            MessageBox MB_ICONEXCLAMATION "Certificate Check Error$\n$\nUnable to verify certificate status.$\n$\nThe certificate installation will be skipped.$\n$\nYou can manually install it later from:$\n$INSTDIR\resources\certificates\"
            Goto cert_done
        ${EndIf}
        
        DetailPrint "DeCicco certificate not found, proceeding with installation..."
        
        ${If} $R7 == "true"
            # Auto-update: Install certificate silently
            DetailPrint "Auto-update detected: Installing certificate silently..."
            nsExec::ExecToLog 'powershell.exe -ExecutionPolicy Bypass -Command "& \"$R1\" -CertificatePath \"$R0\""'
            Pop $R3
            
            ${If} $R3 == 0
                DetailPrint "Certificate installed successfully during auto-update!"
            ${Else}
                DetailPrint "Certificate installation failed during auto-update (Error: $R3)"
                # Even during auto-update, show error dialog for troubleshooting
                MessageBox MB_ICONEXCLAMATION "Certificate Installation Failed$\n$\nError Code: $R3$\n$\nAuto-updates may show security warnings.$\n$\nYou can manually install the certificate from:$\n$INSTDIR\resources\certificates\"
            ${EndIf}
        ${Else}
            # First-time installation: Show informative dialog for internal employees
            DetailPrint "First-time installation detected: Requesting certificate installation..."
            MessageBox MB_ICONINFORMATION|MB_YESNO "DeCicco & Sons Certificate Installation$\n$\nFor company employees: This will install the DeCicco & Sons certificate to enable seamless automatic updates.$\n$\n✓ No administrator privileges required$\n✓ Installs to your user account only$\n✓ Eliminates security warnings$\n✓ Enables automatic app updates$\n$\nRecommended for all company employees.$\n$\nInstall certificate now?" IDYES install_cert IDNO skip_cert
            
            install_cert:
                DetailPrint "Installing certificate for current user..."
                nsExec::ExecToLog 'powershell.exe -ExecutionPolicy Bypass -Command "& \"$R1\" -CertificatePath \"$R0\""'
                Pop $R3
                
                ${If} $R3 == 0
                    DetailPrint "Certificate installed successfully!"
                    MessageBox MB_ICONINFORMATION "Certificate Installation Successful!$\n$\n✓ DeCicco & Sons certificate installed$\n✓ Automatic updates enabled$\n✓ No more security warnings$\n$\nYour Bills Utility app is now ready for seamless updates."
                ${Else}
                    DetailPrint "Certificate installation failed (Error: $R3)"
                    MessageBox MB_ICONEXCLAMATION "Certificate Installation Failed$\n$\nError Code: $R3$\n$\nThe app will still work normally, but you may see security warnings during automatic updates.$\n$\nTo install manually later:$\n1. Navigate to: $INSTDIR\resources\certificates\$\n2. Run: install-certificate.ps1"
                ${EndIf}
                Goto cert_done
            
            skip_cert:
                DetailPrint "Certificate installation declined by user."
                MessageBox MB_ICONINFORMATION "Certificate Installation Skipped$\n$\nThe Bills Utility app will work normally, but you may see security warnings during automatic updates.$\n$\nTo install the certificate later:$\n• Navigate to: $INSTDIR\resources\certificates\$\n• Run: install-certificate.ps1$\n$\nOr contact IT support for assistance."
        ${EndIf}
    ${Else}
        DetailPrint "Certificate file not found: $R0"
        # Show error dialog for missing certificate file
        MessageBox MB_ICONEXCLAMATION "Certificate File Missing$\n$\nThe certificate file was not found:$\n$R0$\n$\nThe app will still work, but you may see security warnings during updates."
    ${EndIf}
    
    cert_done:
FunctionEnd

# Install certificate after files are copied
Function .onInstSuccess
    # Call our certificate installation function
    Call InstallCertificate
FunctionEnd

# Custom page to show certificate installation info
Function CertificateInfoPage
    !insertmacro MUI_HEADER_TEXT "Certificate Installation" "Setting up automatic updates"
    
    nsDialogs::Create 1018
    Pop $0
    
    ${NSD_CreateLabel} 0 0 100% 20u "The Bills Utility app uses a DeCicco & Sons certificate for secure automatic updates."
    Pop $1
    
    ${NSD_CreateLabel} 0 25u 100% 20u "The installer will automatically check if the certificate is already installed."
    Pop $2
    
    ${NSD_CreateLabel} 0 50u 100% 20u "Installing the certificate will:"
    Pop $3
    
    ${NSD_CreateLabel} 20u 70u 100% 20u "• Enable seamless automatic updates"
    Pop $4
    
    ${NSD_CreateLabel} 20u 85u 100% 20u "• Eliminate security warnings"
    Pop $5
    
    ${NSD_CreateLabel} 20u 100u 100% 20u "• Improve user experience"
    Pop $6
    
    ${NSD_CreateLabel} 0 125u 100% 20u "Auto-updates will install silently without prompts."
    Pop $7
    
    nsDialogs::Show
FunctionEnd

# Add certificate info page to installer flow (optional)
# Uncomment the lines below if you want to show an information page
# !insertmacro MUI_PAGE_CUSTOM CertificateInfoPage