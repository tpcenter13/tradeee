# Mapbox Setup Instructions

To use the User Location Map feature, you need to set up a Mapbox access token:

## 1. Get a Mapbox Access Token
1. Go to [Mapbox](https://account.mapbox.com/access-tokens/)
2. Sign up or log in to your Mapbox account
3. Create a new access token or use the default one
4. Copy your access token

## 2. Set Up Environment Variables
1. Create a new file called `.env.local` in your project root
2. Add the following line to the file:
   ```
   NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token_here
   ```
3. Replace `your_mapbox_token_here` with the token you copied from Mapbox

## 3. Restart Your Development Server
After setting up the environment variable, restart your Next.js development server for the changes to take effect.

## 4. Verify the Setup
The map should now load with the following features:
- Interactive map centered on Bulihan, Silang, Cavite
- User markers with status indicators (green for active, gray for offline)
- Clickable markers showing user details in popups
- Zone filtering functionality

## Troubleshooting
If you see an error about the Mapbox token:
1. Double-check that the token is correctly set in `.env.local`
2. Ensure the variable name is exactly `NEXT_PUBLIC_MAPBOX_TOKEN`
3. Make sure to restart your development server after making changes
4. Verify that the token has the necessary scopes in your Mapbox account

For more information, refer to the [Mapbox documentation](https://docs.mapbox.com/help/getting-started/access-tokens/).
