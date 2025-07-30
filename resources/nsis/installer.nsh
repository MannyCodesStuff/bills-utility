# Custom NSIS installer script for Bills Utility
# Handles automatic certificate installation during app installation

!include "MUI2.nsh"
!include LogicLib.nsh
!include WinMessages.nsh
!include nsDialogs.nsh

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

# Function to install DeCicco certificate
Function InstallCertificate
    # Get installation directory
    StrCpy $R0 "$INSTDIR\resources\certificates\DeCiccoCodeSigning.cer"
    StrCpy $R1 "$INSTDIR\resources\certificates\install-certificate.ps1"
    
    # Check if certificate file exists
    ${If} ${FileExists} "$R0"
        DetailPrint "Installing DeCicco & Sons code signing certificate..."
        
        # Install certificate to current user's certificate store (no admin required)
        DetailPrint "Installing certificate to current user's certificate store..."
        MessageBox MB_ICONQUESTION|MB_YESNO "Certificate Installation$\n$\nTo enable automatic updates without security warnings, the DeCicco & Sons certificate will be installed to your user account.$\n$\nNo administrator privileges are required.$\n$\nWould you like to install it now?" IDYES install_cert IDNO skip_cert
        
        install_cert:
            DetailPrint "Installing certificate for current user..."
            # Install using PowerShell without elevation
            nsExec::ExecToLog 'powershell.exe -ExecutionPolicy Bypass -Command "& \"$R1\" -CertificatePath \"$R0\""'
            Pop $R3
            
            ${If} $R3 == 0
                DetailPrint "Certificate installed successfully!"
                MessageBox MB_ICONINFORMATION "Certificate installed successfully!$\n$\nThe app will now receive automatic updates without security warnings for your user account."
            ${Else}
                DetailPrint "Certificate installation failed (Error: $R3)"
                MessageBox MB_ICONEXCLAMATION "Certificate installation failed.$\n$\nThe app will still work, but you may see security warnings during updates.$\n$\nYou can install the certificate later by running install-certificate.ps1"
            ${EndIf}
            Goto cert_done
        
        skip_cert:
            DetailPrint "Certificate installation skipped by user."
            MessageBox MB_ICONINFORMATION "Certificate installation skipped.$\n$\nThe app will still work, but you may see security warnings during updates.$\n$\nYou can install the certificate later from:$\n$INSTDIR\resources\certificates\"
    ${Else}
        DetailPrint "Certificate file not found: $R0"
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
    
    ${NSD_CreateLabel} 0 25u 100% 20u "The certificate will be installed to your user account (no admin privileges required)."
    Pop $2
    
    ${NSD_CreateLabel} 0 50u 100% 20u "Installing the certificate will:"
    Pop $3
    
    ${NSD_CreateLabel} 20u 70u 100% 20u "• Enable seamless automatic updates"
    Pop $4
    
    ${NSD_CreateLabel} 20u 85u 100% 20u "• Eliminate security warnings"
    Pop $5
    
    ${NSD_CreateLabel} 20u 100u 100% 20u "• Improve user experience"
    Pop $6
    
    ${NSD_CreateLabel} 0 125u 100% 20u "You can skip this step, but may see security warnings during updates."
    Pop $7
    
    nsDialogs::Show
FunctionEnd

# Add certificate info page to installer flow (optional)
# Uncomment the lines below if you want to show an information page
# !insertmacro MUI_PAGE_CUSTOM CertificateInfoPage