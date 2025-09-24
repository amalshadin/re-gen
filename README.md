♻️ ReGen - The Smart Recycling Assistant
ReGen is a mobile application built with React Native that helps users make eco-friendly decisions. By simply scanning an item, users receive AI-powered advice on the most sustainable disposal methods, including recycling, upcycling, and composting. The app uses a gamified approach with points and badges to encourage consistent, positive environmental impact.

✨ Features
📷 Item Scanning: Use your device's camera or upload an image to scan any item.

🤖 AI Analysis: Leverages the Google Gemini API to identify the item and its material.

🌿 Sustainable Advice: Provides clear, actionable instructions on how to dispose of the item responsibly.

💡 Creative Ideas: Suggests upcycling ideas and eco-friendly alternatives.

🏆 Gamification: Earn "Eco-Points" for each scan and unlock badges as you reach milestones.

👤 User Profiles: Track your points, view unlocked badges, and see your scan history.

🌗 Light & Dark Mode: A comfortable viewing experience in any lighting condition.

🔧 Tech Stack
Framework: React Native (with Expo)

Backend & Database: Supabase for user authentication and data storage.

AI Engine: Google Gemini API for image analysis and content generation.

🚀 Getting Started
To get a local copy up and running, follow these simple steps.

Prerequisites
Make sure you have the following installed on your machine:

Node.js (LTS version recommended)

Git

Expo CLI:

Bash

npm install -g expo-cli
Installation & Setup
Clone the repository:

Bash

git clone https://github.com/amalshadin/re-gen.git
Navigate to the project directory:

Bash

cd ReGen
Install NPM packages:

Bash

npm install
Set up environment variables:
Create a file named .env in the root of the project and add the necessary API keys and URLs. See the Environment Variables section below for details.

Running the App
Start the Metro bundler:

Bash

npx expo start
Run on your device:
Scan the QR code shown in the terminal with the Expo Go app on your Android or iOS device.

🔑 Environment Variables
To run this project, you will need to add the following environment variables to your .env file in the project root.

Create a .env file and copy the contents of .env.example (if available) or use the template below:

# Supabase
SUPABASE_URL="YOUR_SUPABASE_URL"
SUPABASE_ANON_KEY="YOUR_SUPABASE_ANON_KEY"

# Google Gemini
GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
SUPABASE_URL & SUPABASE_ANON_KEY: Found in your Supabase project's API settings.

GEMINI_API_KEY: Your API key from Google AI Studio.

🤝 Contributing
Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are greatly appreciated.

Fork the Project

Create your Feature Branch (git checkout -b feature/AmazingFeature)

Commit your Changes (git commit -m 'Add some AmazingFeature')

Push to the Branch (git push origin feature/AmazingFeature)

Open a Pull Request

📄 License
Distributed under the MIT License. See LICENSE for more information.
