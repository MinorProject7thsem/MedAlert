# MedAlert AI – README

## Overview
MedAlert AI is a full-stack AI-powered web application that analyzes food and medicine labels using OCR and Google Gemini AI. The system compares extracted ingredients with the user’s health profile (allergies, blood pressure, sugar levels, medications) and generates personalized safety reports.

## Features

### 1. User & Health Profile
- Secure login and signup (JWT authentication)
- Create and update health profile:
  - Allergies
  - Blood Pressure
  - Sugar Levels
  - Medications
- Password update feature

### 2. AI Ingredient Scanning
- Upload or capture image of product label
- OCR extracts raw text
- Gemini AI cleans, analyzes, and structures the text
- Personalized alerts and recommendations

### 3. Report System
- Structured detailed report for every scan
- Alerts for harmful ingredients
- Saved report history
- Ability to delete reports

### 4. Tech Stack
- Frontend: React.js  
- Backend: Node.js + Express.js  
- Database: MongoDB  
- OCR: OCR.space API  
- AI Model: Google Gemini  
- Image Handling: Multer + Sharp  

## Project Structure
MedAlert-AI/
│── backend/
│ ├── controllers/
│ ├── routes/
│ ├── middleware/
│ ├── models/
│ ├── utils/
│ ├── server.js
│ ├── .env
│
│── frontend/
│ ├── src/
│ ├── components/
│ ├── pages/
│ ├── App.js
│
│── README.md


## How the System Works
1. User uploads an image  
2. Image is sent to backend using Multer  
3. Sharp optimizes the image  
4. OCR.space extracts text  
5. Backend fetches user’s health profile  
6. Gemini AI performs text cleaning, ingredient extraction, and risk analysis  
7. Structured report is saved to MongoDB  
8. Frontend displays the report  

## Installation Guide

### Backend Setup
cd backend
npm install
npm start



### Frontend Setup
cd frontend
npm install
npm start


## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | /auth/register         | Register user |
| POST   | /auth/login            | User login |
| PUT    | /auth/update-password  | Update password |

### Health Profile
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | /profile/create  | Create profile |
| PUT    | /profile/update  | Update profile |
| GET    | /profile/me      | Get user profile |

### Scanning & Reports
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | /scan/ocr            | OCR extraction |
| POST   | /scan/analyze        | Gemini AI analysis |
| GET    | /reports             | Fetch report history |
| DELETE | /reports/:id         | Delete report |

## Testing Strategy
- Unit testing for backend routes  
- Integration testing for end-to-end scan workflow  
- Error testing for:
  - Blurry images  
  - Missing text  
  - Invalid health data  
  - Expired tokens  

## System Highlights
- Personalized real-time AI health analysis  
- Works even with noisy/blurry images  
- Responsive and clean UI  
- Secure encrypted data handling  
- Fast OCR and optimized pipeline  

## Future Enhancements
- Multi-language OCR & analysis  
- Product barcode scanning  
- Medication interaction checker  
- AI-based diet recommendations  
- Voice-based product scanning  

## Live Deployment
Frontend: https://med-alert-frontend.vercel.app

