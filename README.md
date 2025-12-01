MedAlert AI – README
🩺 MedAlert AI – AI-Powered Health & Ingredient Analysis
MedAlert AI is a full-stack web application that analyzes food and medicine labels using OCR and Google Gemini AI. It matches extracted ingredients with the user's health profile (allergies, BP, sugar levels, medications) and generates instant, personalized health reports with caution alerts.

🚀 Features
🔐 User Management & Health Profile
Secure login & signup (JWT authentication)

Add/update health profile:
Allergies
Blood Pressure
Sugar Levels
Medications
Change password feature


📸 AI Ingredient Scanning
Upload or click image of product label
OCR extracts text from the image
Gemini AI cleans, analyzes & generates structured output
Personalized alerts & recommendations

📊 Report System
Detailed health assessment for every scan
Alerts for harmful ingredients
Saved report history
Delete old reports

🎯 Tech Stack
Frontend: React.js
Backend: Node.js + Express.js
Database: MongoDB
OCR: OCR.space API


📁 Project Structure
MedAlert-AI/
│── backend/
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   ├── models/
│   ├── server.js
│   ├── .env
│── frontend/
│   ├── src/
│   ├── components/
│   ├── pages/
│   ├── App.js
│── README.md

🧠 How the System Works
1️⃣ User uploads image
2️⃣ Image sent to backend via Multer
3️⃣ Sharp optimizes image
4️⃣ OCR.space extracts raw text
5️⃣ Backend fetches user health profile
6️⃣ Gemini AI performs:
Text cleanup
Ingredient identification
Risk analysis
JSON report creation
7️⃣ Report saved to MongoDB
8️⃣ React frontend displays structured report

🔧 Installation Guide
Backend Setup
cd backend
npm install
npm start

Create a .env file:
MONGO_URI=your_mongo_url
OCR_API_KEY=your_ocr_key
GEMINI_API_KEY=your_gemini_key
JWT_SECRET=your_secret

Frontend Setup
cd frontend
npm install
npm start

🔍 API Endpoints
Authentication
Method	Endpoint	Description
POST	/auth/register	Register user
POST	/auth/login	Login user
PUT	/auth/update-password	Update password
Health Profile
Method	Endpoint	Description
POST	/profile/create	Create profile
PUT	/profile/update	Update profile
GET	/profile/me	Get profile
Scanning & Reports
Method	Endpoint	Description
POST	/scan/ocr	OCR extraction
POST	/scan/analyze	Gemini analysis
GET	/reports	Fetch report history
DELETE	/reports/:id	Delete a report

🧪 Testing Strategy
Unit Testing for backend API routes
Integration testing for full pipeline

Error handling testing:
Blurry images
Missing ingredients
Incorrect health profile
Invalid tokens

⭐ Highlights of the System
AI-powered personalized health safety
Works with noisy/blurry images
Cross-platform responsive UI
Secure and encrypted data handling
Fast and optimized OCR pipeline

🔮 Future Improvements
Multi-language OCR & AI support
Product barcode scanning
Medication interaction checker
AI-powered diet recommendations
Voice-based real-time product scanning

You can use it:-
Live Link: https://med-alert-frontend.vercel.app
