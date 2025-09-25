# ♻️ ReGen - The Smart Recycling Assistant

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![React Native](https://img.shields.io/badge/React_Native-0.71.11-blue.svg)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-Managed-yellow.svg)](https://expo.dev/)

ReGen is a **mobile application** built with React Native that helps users make **eco-friendly decisions**. By scanning an item, users receive **AI-powered advice** on the most sustainable disposal methods, including **recycling, upcycling, and composting**.  
The app uses a **gamified approach** with points and badges to encourage consistent, positive environmental impact.

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 📷 **Item Scanning** | Use your camera or upload an image to scan items. |
| 🤖 **AI Analysis** | Uses Google Gemini API to identify the item and its material. |
| 🌿 **Sustainable Advice** | Clear instructions for responsible disposal. |
| 💡 **Creative Ideas** | Upcycling suggestions and eco-friendly alternatives. |
| 🏆 **Gamification** | Earn Eco-Points and unlock badges for milestones. |
| 👤 **User Profiles** | Track points, badges, and scan history. |
| 🌗 **Light & Dark Mode** | Comfortable viewing in any lighting condition. |

---

## 🔧 Tech Stack

- **Framework:** [React Native](https://reactnative.dev/) with [Expo](https://expo.dev/)
- **Backend & Database:** [Supabase](https://supabase.com/)
- **AI Engine:** [Google Gemini API](https://ai.google.com/)

---

## 🚀 Getting Started

Follow these steps to set up the project locally.

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS version recommended)  
- [Git](https://git-scm.com/)  
- [Expo CLI](https://docs.expo.dev/get-started/installation/)

Installation:
```sh
npm install -g expo-cli
# Clone the repo
git clone https://github.com/amalshadin/re-gen.git

# Go to the project directory
cd ReGen

# Install dependencies
npm install

```
Setup Environment Variables:
```
Create a .env file in the root and add:
# Supabase
SUPABASE_URL="YOUR_SUPABASE_URL"
SUPABASE_ANON_KEY="YOUR_SUPABASE_ANON_KEY"

# Google Gemini
GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
```
Install Additional Packages for imported Modules
```
npx expo install <package-name>
```
Running the App:
```
# Start Metro Bundler
npx expo start
```
---

## 🛠️Building Your App with EAS
  1. Create an Expo account and login in.
```
# Login to expo account 
  npx eas login
```
2. Configure the build files.
```
# Configure the build file (eas.json)
eas build:configure
# You may have to manually add the eas project id (recieved from expo via the terminal ) to the app.config.js as expo cannot automatically update the file.
#ignore it if you're using environment key with app.json (not app.config.js).

```
3. Manage Secrets
```
# create new secrete (replace YOUR_SECRET_NAME with your key/url variable and your_secret_value with the actual key/url.
npx eas secret:create --scope project --name YOUR_SECRET_NAME --value "your_secret_value"
```
4. Verify the secrets
```
npx eas secret:list
```
5. Build
```
# change pplatform name and build profile accordingly
eas build --platform android --profile development
```
6. Scan the QR/ goto the link and download your app and install it.

---
## 🤝 Contributing

1. Contributions are welcome!
2. Fork the project
3. Create your feature branch (git checkout -b feature/AmazingFeature)
4. Commit your changes (git commit -m 'Add some AmazingFeature')
5. Push to the branch (git push origin feature/AmazingFeature)
6. Open a Pull Request
---

## 📄 License

Distributed under the MIT License. See [License](./LICENSE.md)
 for details.
