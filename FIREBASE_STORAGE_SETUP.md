# Firebase Storage Setup Guide

## Problem
Profile photo uploads are failing with CORS errors because Firebase Storage is not enabled.

## Error Messages You're Seeing
```
Access to XMLHttpRequest at 'https://firebasestorage.googleapis.com/...' has been blocked by CORS policy
POST https://firebasestorage.googleapis.com/... net::ERR_FAILED
Error: Firebase Storage has not been set up on project 'gratis-ngo-7bb44'
```

## Solution: Enable Firebase Storage

### Step 1: Open Firebase Console
Go to: https://console.firebase.google.com/project/gratis-ngo-7bb44/storage

### Step 2: Click "Get Started"
- Click the blue "Get started" button
- A dialog will appear with Storage setup options

### Step 3: Choose Security Rules
Select **"Start in production mode"** (we already have custom rules in `storage.rules`)
- Click "Next"

### Step 4: Select Location
Choose your Cloud Storage location:
- Recommended: `europe-west1` (Belgium) for EU/Netherlands
- Or: `us-central1` (Iowa) for US
- Click "Done"

### Step 5: Wait for Provisioning
Firebase will take a few seconds to provision your Storage bucket.

### Step 6: Deploy Storage Rules
After Storage is enabled, deploy the security rules:

```powershell
firebase deploy --only storage
```

This will deploy the rules from `storage.rules` which includes:
- Avatar uploads in `avatars/{userId}/` folder
- Product images for admins
- Event images for admins
- Job application resumes

## Verify It Works

### Test 1: Check Firebase Console
1. Go to: https://console.firebase.google.com/project/gratis-ngo-7bb44/storage
2. You should see your Storage bucket (without the "Get started" button)
3. You should see "Rules" and "Files" tabs

### Test 2: Upload a Profile Photo
1. Go to: https://gratis-ngo-7bb44.web.app/profile
2. Click "Change Photo"
3. Select an image (max 2MB)
4. The upload should complete successfully
5. Check browser console (F12) - should show:
   - "Starting photo upload..."
   - "Upload complete"
   - "Download URL: https://..."
   - "Firestore updated successfully"

### Test 3: Verify in Firebase Console
1. Go to Storage Files tab
2. Navigate to `avatars/` folder
3. You should see your uploaded photo

## Storage Rules (Already Configured)

The `storage.rules` file includes:

```
// User avatars (profile photos)
match /avatars/{userId}/{fileName} {
  allow read: if true;  // Anyone can view avatars
  allow write: if isAuthenticated()
               && request.auth.uid == userId
               && isValidImageUpload();  // Max 5MB, images only
}
```

## Troubleshooting

### Issue: "Permission denied" after enabling Storage
**Solution:** Make sure you deployed the storage rules:
```powershell
firebase deploy --only storage
```

### Issue: "CORS error" still appearing
**Solutions:**
1. Wait 1-2 minutes after enabling Storage (propagation time)
2. Clear browser cache and reload
3. Check that Storage is enabled in Firebase Console
4. Verify storage rules are deployed

### Issue: "Quota exceeded"
**Solution:** Firebase free tier includes:
- 5GB storage
- 1GB/day downloads
- 20,000/day uploads

If you exceed this, upgrade to Blaze (pay-as-you-go) plan.

## Alternative: Use Image URLs

If you can't enable Firebase Storage immediately, you can temporarily use a direct image URL:

1. Upload your image to any image hosting service:
   - Imgur: https://imgur.com
   - Cloudinary: https://cloudinary.com
   - ImgBB: https://imgbb.com

2. Use the image URL in your profile
3. The app will display the image from the external URL

## Cost Considerations

**Free Tier (Spark Plan):**
- Storage: 5GB
- Downloads: 1GB/day
- Uploads: 20,000/day
- **Cost:** FREE

**Paid Tier (Blaze Plan):**
- Storage: $0.026/GB per month
- Downloads: $0.12/GB
- Uploads: $0.05/10,000 operations
- **Typical Cost for Profile Photos:** ~$1-2/month for 100 active users

## Security

Your storage rules ensure:
- ✅ Only authenticated users can upload
- ✅ Users can only upload to their own folder
- ✅ File size limited to 5MB
- ✅ Only image files allowed
- ✅ Anyone can view avatars (public read)

## Next Steps

1. **Enable Storage** (steps above)
2. **Deploy rules:** `firebase deploy --only storage`
3. **Test upload:** Upload a profile photo
4. **Verify:** Check Firebase Console for uploaded file
5. **Done!** ✅

## Need Help?

Check Firebase documentation:
- Storage Guide: https://firebase.google.com/docs/storage
- Security Rules: https://firebase.google.com/docs/storage/security
- CORS Configuration: https://firebase.google.com/docs/storage/web/download-files#cors_configuration
