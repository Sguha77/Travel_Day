<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/5242fec8-897b-4f77-99ca-52aaa88a3d0f

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
# ✈️ Travel Day — Smart Journey Companion

> A modern, intelligent travel companion that turns a flight or train journey into a clear, step-by-step travel timeline.

Travel Day is a **React + TypeScript + Tailwind CSS** web application designed to help travelers organize and follow their journey from departure preparation to arrival.

It combines a colorful modern interface, journey progress tracking, travel details, boarding-pass access, personal notes, AI assistance, and light/dark themes in one place.

---

## ✨ Features

### 🧭 Smart Journey Timeline

- Step-by-step itinerary for your journey
- Departure, transit, check-in, boarding, journey, and arrival stages
- Visual journey progress tracking
- Mark individual journey steps as completed
- Active and urgent journey states
- Personal travel notes

### ✈️ Flight & 🚆 Train Support

Travel Day supports both flight and train journeys.

#### Flight Information

- Airline / flight identifier
- Departure and arrival airports
- Gate
- Seat
- Terminal
- Boarding time
- Baggage information
- Security preferences

#### Train Information

- Train identifier
- Departure and arrival stations
- Platform
- Coach
- Departure and arrival times
- Journey duration

---

## 🎫 Boarding Pass

Travel Day provides quick access to a dedicated boarding-pass interface.

The boarding pass view keeps important journey information easily accessible while traveling.

---

## 🤖 AI Travel Companion

A dedicated AI assistant interface is included for future AI-powered travel functionality.

The architecture is designed to support features such as:

- Travel questions
- Journey assistance
- Trip recommendations
- Travel alerts
- Personalized itinerary suggestions
- Context-aware travel assistance

---

## 🌦️ Travel Information

The application can display useful journey information including:

- 🌤️ Origin weather
- 🌦️ Destination weather
- 🧳 Baggage-drop status
- 🛡️ Security / TSA preference
- 🚗 Transit preference
- 🕐 Boarding time
- 📍 Terminal / platform
- 🎫 Seat / coach

---

## 📝 Personal Travel Notes

Travelers can add custom notes directly to their journey.

For example:

```text 
Remember to collect luggage
Buy snacks before boarding
Call family after landing
Check hotel booking

These notes become part of the journey timeline.
```

🌗 Light & Dark Mode
```text
Travel Day includes a complete light/dark theme system.

Features include:

Light theme
Dark theme
Animated theme toggle
Persistent theme preference
Responsive theme-aware components

The selected theme is stored locally in the browser.
```
💾 Local Data Persistence

Travel Day currently uses browser localStorage to persist application data.

Stored information includes:

Saved trips
Completed journey steps
Theme preference

No backend database is required for the current version.

---

🎨 UI & Design

Travel Day focuses on a modern, colorful and premium travel experience.

Design Elements
Glassmorphism cards
Gradient backgrounds
Animated timeline
Floating ambient effects
Responsive layouts
Rounded modern components
Interactive buttons
Smooth micro-interactions
Mobile-friendly navigation

The interface is designed around one central question:

"What do I need to do next?"

Instead of presenting travel information as static data, Travel Day organizes the information around the traveler's journey timeline.

---

🛠️ Tech Stack

Technology	Purpose
React	User interface
TypeScript	Type-safe development
Vite	Development & build tooling
Tailwind CSS	Styling
Lucide React	Interface icons
Material Symbols	Timeline icons
LocalStorage	Client-side persistence

---

📁 Project Structure

```text
Travel_Day/
│
├── public/
│
├── src/
│   │
│   ├── components/
│   │   ├── AIAssistantDrawer.tsx
│   │   ├── AddTripForm.tsx
│   │   ├── BoardingPassModal.tsx
│   │   ├── BottomNav.tsx
│   │   ├── Header.tsx
│   │   ├── ProcessingScreen.tsx
│   │   ├── SettingsModal.tsx
│   │   └── TimelineView.tsx
│   │
│   ├── data/
│   │   └── mockTrips.ts
│   │
│   ├── utils/
│   │   └── timelineGenerator.ts
│   │
│   ├── App.tsx
│   ├── index.css
│   ├── main.tsx
│   └── types.ts
│
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```
---

🚀 Getting Started

1. Clone the Repository
git clone https://github.com/Sguha77/Travel_Day.git
2. Navigate to the Project
cd Travel_Day
3. Install Dependencies
npm install
4. Start the Development Server
npm run dev

The application will be available at:

http://localhost:5173

🏗️ Production Build

Create an optimized production build:

npm run build

Preview the production build:

npm run preview
🧩 Core Architecture
App.tsx

The main application controller.

Responsible for:

Trip state
Active trip selection
Navigation
Theme state
Modal state
Trip creation
Timeline completion
LocalStorage persistence
TimelineView.tsx

The main travel dashboard.

Responsible for:

Journey overview
Route visualization
Journey progress
Timeline steps
Travel actions
Personal notes
Header.tsx

Provides:

Trip switching
Add Trip
AI Companion
Theme toggle
Settings access
Active journey information
AddTripForm.tsx

Handles creation of new journeys.

Users can provide information such as:

Origin
Destination
Flight / Train
Identifier
Departure time
Transit preference
Baggage preference
Security preference
timelineGenerator.ts

Generates the journey timeline based on the selected trip information.

The generated timeline can contain stages such as:

Weather
Travel Alert
Transit
Check-in
Boarding
Journey
Arrival
Custom Notes
BoardingPassModal.tsx

Displays boarding-pass information for the selected journey.

AIAssistantDrawer.tsx

Provides the interface for the AI travel companion.

📱 Responsive Design

Travel Day is designed for both desktop and mobile devices.

Desktop
Expanded navigation
Multi-column journey information
Large route overview
Full timeline interface
Mobile
Compact header
Bottom navigation
Responsive route layout
Touch-friendly controls
Mobile-optimized timeline
Responsive cards

---

🔄 Application Flow
```text
             ┌─────────────────┐
             │   Travel Day    │
             └────────┬────────┘
                      │
                      ▼
             ┌─────────────────┐
             │ Select / Create │
             │      Trip       │
             └────────┬────────┘
                      │
                      ▼
             ┌─────────────────┐
             │  Trip Details   │
             └────────┬────────┘
                      │
                      ▼
             ┌─────────────────┐
             │ Smart Journey   │
             │    Timeline     │
             └────────┬────────┘
                      │
             ┌────────┴────────┐
             ▼                 ▼
      ┌─────────────┐   ┌──────────────┐
      │ Travel      │   │ Boarding     │
      │ Actions     │   │ Pass         │
      └──────┬──────┘   └──────────────┘
             │
             ▼
      ┌─────────────┐
      │ Complete    │
      │ Journey     │
      └─────────────┘
```
---

🔐 Data & Privacy

The current version of Travel Day is primarily client-side.

Trip information is stored using:

localStorage

There is currently no required backend database or authentication system.

This makes the project simple to run locally and suitable for:

Learning
UI experimentation
Portfolio development
Frontend development
Travel application prototyping
🗺️ Roadmap

Future improvements planned for Travel Day include:

 Real-time flight status
 Real-time train status
 Live weather API
 Google Maps / Mapbox integration
 Real boarding-pass QR codes
 Airport navigation
 Railway station navigation
 AI-powered itinerary recommendations
 AI travel assistant with live travel data
 Calendar integration
 Push notifications
 Flight delay alerts
 Train delay alerts
 User authentication
 Cloud trip synchronization
 Offline / PWA support
 Multi-language support
💡 Use Cases

Travel Day can be used as:

✈️ Flight journey planner
🚆 Train journey companion
🧳 Personal travel organizer
📅 Trip preparation dashboard
🤖 AI travel assistant
🎓 React / TypeScript learning project
💻 Frontend portfolio project
🎨 UI/UX experimentation project
🎯 Project Goals

The main goals of Travel Day are:

1. Simplify Travel Information

Keep important travel information in one place.

2. Make Travel Actionable

Instead of showing only information, provide clear next steps.

3. Create a Modern Travel Experience

Use modern UI patterns to make travel planning more engaging.

4. Prepare for AI Integration

Build a foundation for future intelligent travel assistance.

🤝 Contributing

Contributions, suggestions and improvements are welcome.

Fork the Repository
git fork https://github.com/Sguha77/Travel_Day

Or create a fork directly through GitHub.

Create a Feature Branch
git checkout -b feature/your-feature-name
Make Your Changes
git add .
Commit Your Changes
git commit -m "Add: your feature description"
Push Your Branch
git push origin feature/your-feature-name

Then create a Pull Request on GitHub.

📄 License

This project is currently intended for learning, experimentation and portfolio purposes.

Please check the repository for the applicable license before redistributing or using the project commercially.

👨‍💻 Author
Subhankar Guha

B.Sc. Information Technology Student

Full Stack Developer • AI & GenAI Learner • Cybersecurity Enthusiast

Connect With Me
GitHub: https://github.com/Sguha77
LinkedIn: https://www.linkedin.com/in/subhankar-07-guha/
⭐ Support

If you find Travel Day interesting or useful, consider giving the repository a ⭐ on GitHub.

Your support helps the project grow!

<p align="center">
✈️ Travel smarter. Journey better.

Built with ❤️ using React + TypeScript + Tailwind CSS + Vite

</p> 
