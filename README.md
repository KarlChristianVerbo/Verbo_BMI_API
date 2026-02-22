# Student Management System - Frontend

A modern React-based frontend for managing student information with fields for Full Name, Course, ID Number, Department, and Current Units.

## Features

- ✅ Add new students
- ✅ View all students in a beautiful card layout
- ✅ Edit existing student records
- ✅ Delete students
- ✅ Form validation
- ✅ Responsive design
- ✅ Modern UI with gradient backgrounds
- ✅ Error handling and loading states

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Backend API running (see Backend Connection section)

## Installation

1. Install dependencies:
```bash
npm install
```

## Configuration

Before running the application, configure your backend API URL:

1. Create a `.env` file in the root directory:
```env
REACT_APP_API_URL=http://localhost:8000/api
```

2. Replace `http://localhost:8000/api` with your actual backend API URL.

Alternatively, you can modify the `API_BASE_URL` in `src/services/api.js`.

## Running the Application

Start the development server:
```bash
npm start
```

The application will open at `http://localhost:3000`

## Backend Connection

This frontend expects a REST API backend with the following endpoints:

### Base URL
The default base URL is `http://localhost:8000/api` (configurable via environment variable)

### Required Endpoints

1. **GET /students** - Get all students
   - Response: Array of student objects
   ```json
   [
     {
       "id": 1,
       "fullName": "John Doe",
       "course": "Computer Science",
       "idNumber": "2024-001",
       "department": "IT",
       "currentUnits": 18
     }
   ]
   ```

2. **GET /students/:id** - Get a single student
   - Response: Student object

3. **POST /students** - Create a new student
   - Request Body:
   ```json
   {
     "fullName": "John Doe",
     "course": "Computer Science",
     "idNumber": "2024-001",
     "department": "IT",
     "currentUnits": 18
   }
   ```
   - Response: Created student object with ID

4. **PUT /students/:id** - Update a student
   - Request Body: Same as POST
   - Response: Updated student object

5. **DELETE /students/:id** - Delete a student
   - Response: Success message or deleted student object

### Student Data Model

```typescript
interface Student {
  id: number | string;
  fullName: string;
  course: string;
  idNumber: string;
  department: string;
  currentUnits: number;
}
```

## Project Structure

```
src/
  ├── components/
  │   ├── StudentList.js      # Component for displaying students
  │   ├── StudentList.css
  │   ├── StudentForm.js       # Form for adding/editing students
  │   └── StudentForm.css
  ├── services/
  │   └── api.js              # API service layer
  ├── App.js                  # Main application component
  ├── App.css
  ├── index.js               # Entry point
  └── index.css
```

## Building for Production

To create a production build:

```bash
npm run build
```

The build folder will contain the optimized production build.

## Technologies Used

- React 18
- Axios (for API calls)
- CSS3 (for styling)

## Troubleshooting

### Backend Connection Issues

If you see "Failed to fetch students" errors:

1. Verify your backend is running
2. Check the API URL in `.env` or `src/services/api.js`
3. Ensure CORS is enabled on your backend
4. Check browser console for detailed error messages

### CORS Issues

If you encounter CORS errors, make sure your backend allows requests from `http://localhost:3000`. You may need to configure CORS headers on your backend.

## License

This project is open source and available for use.
