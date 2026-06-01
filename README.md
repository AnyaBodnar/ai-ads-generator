Next.js Project Setup Guide
Requirements
Before starting, make sure you have installed:

Node.js (LTS version)
npm
Download Node.js here: https://nodejs.org

Environment Variables
Before running the project, create a .env file in the root folder of the project.

Add the following variables:

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/

# Deployment used by `npx convex dev`
CONVEX_DEPLOYMENT=your_convex_deployment

NEXT_PUBLIC_CONVEX_URL=your_convex_url

OPENROUTER_API_KEY=your_openrouter_api_key

AKOOL_API_TOKEN=your_akool_api_token
AKOOL_CLIENT_ID=your_akool_client_id

NEXT_PUBLIC_IMAGEKIT_URL=your_imagekit_url
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
NEXT_PUBLIC_IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key

INNGEST_EVENT_KEY=local
INNGEST_DEV=1
Important
After the first run of:

npx convex dev
Convex may generate new deployment values.

You need to update these lines in the .env file with the newly generated values:

CONVEX_DEPLOYMENT=...
NEXT_PUBLIC_CONVEX_URL=...
Use the values shown in the terminal after running npx convex dev.

Installation
Open the project folder in VS Code and run the following command in the terminal:

npm install
This command installs all project dependencies from package.json.

Running the Project
The project requires running 3 separate processes.

1. Start Convex
Open the first terminal and run:

npx convex dev
This starts the Convex backend and database connection.

Keep this terminal running.

2. Start Next.js
Open a second terminal and run:

npm run dev
This starts the Next.js development server.

After successful startup, the project will be available at:

http://localhost:3000
3. Start Inngest
Open a third terminal and run:

npx --ignore-scripts=false inngest-cli@latest dev -u http://localhost:3000/api/inngest
This starts the Inngest development server for background jobs and event handling.

Keep this terminal running.

Final Structure
You should have 3 active terminals running:

Terminal 1
npx convex dev
Terminal 2
npm run dev
Terminal 3
npx --ignore-scripts=false inngest-cli@latest dev -u http://localhost:3000/api/inngest
Stopping the Project
To stop any running process, press:

Ctrl + C
Common Issues
npm is not recognized
Node.js is not installed correctly.

Reinstall Node.js from: https://nodejs.org

Port 3000 is already in use
Another application is using port 3000.

Stop the conflicting process or run the app on another port.

Reinstall Dependencies
If dependencies are broken:

Delete:

node_modules
package-lock.json
Run:

npm install
