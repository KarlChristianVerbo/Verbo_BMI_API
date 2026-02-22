# BMI Calculator System

A complete Body Mass Index (BMI) calculator system with database integration, built with Node.js, Express, and MySQL.

## Features

- **User Information Collection**: Collect name, age, and gender before calculating BMI
- **BMI Calculation**: Calculate BMI based on height and weight
- **Automatic Category Classification**: Classifies as Underweight, Normal, Overweight, or Obese
- **History Tracking**: View all past BMI calculations for each user
- **Database Storage**: All BMI records are saved with user information
- **Beautiful, Modern UI**: Clean and user-friendly interface
- **RESTful API Endpoints**: Complete API for BMI operations

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MySQL
- **Frontend**: HTML, CSS, JavaScript

## Installation

1. Clone the repository:
```bash
git clone https://github.com/KarlChristianVerbo/Verbo_API.git
cd Verbo_API
```

2. Navigate to the backend folder:
```bash
cd backend
```

3. Install dependencies:
```bash
npm install
```

4. Configure database in `backend/database.js`:
```javascript
const dbConfig = {
    host: "localhost",
    user: "root",
    password: "",  // Your MySQL password
    database: "bmi_calculator"
};
```

5. Start the server:
```bash
npm run dev
```

Or:
```bash
npm start
```

6. Open your browser and navigate to:
```
http://localhost:3000
```

## Database Setup

The database will be automatically created when you start the server. Make sure MySQL is running.

Alternatively, you can manually run:
```bash
mysql -u root -p < backend/database.sql
```

## API Endpoints

### Calculate BMI
- **POST** `/api/bmi/calculate`
- **Body**: `{ name, age, gender, height, weight }`
- **Response**: `{ success, bmi, category, recordId }`

### Get All BMI Records
- **GET** `/api/bmi/records`
- **Response**: `{ success, records: [...] }`

### Get BMI History by Name
- **GET** `/api/bmi/history/:name`
- **Response**: `{ success, records: [...] }`

## Usage

1. Enter your information (name, age, gender)
2. Enter height and weight
3. Click "CALCULATE" to see your BMI
4. Click "💾 Save to History" to save the record
5. Click "📋 View History" to see all your saved records

## BMI Categories

- **Underweight**: BMI < 18.5
- **Normal**: BMI 18.5 - 24.9
- **Overweight**: BMI 25 - 29.9
- **Obese**: BMI ≥ 30

## Project Structure

```
Verbo_API/
├── backend/
│   ├── database.js          # Database connection and queries
│   ├── database.sql         # SQL schema file
│   ├── server.js            # Express server and API routes
│   ├── package.json         # Dependencies
│   └── public/              # Frontend files
│       ├── index.html       # Main HTML file
│       ├── style.css        # Styling
│       └── script.js         # JavaScript functionality
└── README.md                # This file
```

## License

This project is open source and available for educational purposes.

## Author

Karl Christian Verbo
