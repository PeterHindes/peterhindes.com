# Set the path to your profile image (update this path to your actual image location)
$imagePath = "C:\Users\user\Documents\GitHub\peterhindes.com\public\profile.jpg"

# Check if the file exists
if (Test-Path $imagePath) {
    # Read the image file as bytes
    $imageBytes = [System.IO.File]::ReadAllBytes($imagePath)
    
    # Convert to base64
    $base64String = [System.Convert]::ToBase64String($imageBytes)
    
    # Output the base64 string to a file (it could be very long)
    $base64String | Out-File -FilePath "C:\Users\user\Documents\GitHub\peterhindes.com\profile-base64.txt"
    
    # Display info
    Write-Host "Base64 encoding complete!"
    Write-Host "The encoded string has been saved to: profile-base64.txt"
    Write-Host "Length of encoded string: $($base64String.Length) characters"
    
    # Create a shortened preview (first 100 characters)
    $preview = $base64String.Substring(0, [Math]::Min(100, $base64String.Length))
    Write-Host "Preview: $preview..."
    
    Write-Host "`nReplace 'YOUR_BASE64_DATA_HERE' in the SVG file with this base64 string."
} else {
    Write-Error "Image file not found at: $imagePath"
    Write-Host "Please update the script with the correct path to your profile image."
}
