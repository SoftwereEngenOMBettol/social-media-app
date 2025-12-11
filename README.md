# Social Media Application
A full-featured social media app built with React and Redux

## Features

### Frontend (React)
- User authentication
- Create/read/update/delete posts
- Like and comment system
- Friend management
- User profiles
- Responsive UI with Bootstrap

### Backend (Node.js/Express)
- RESTful API
- MongoDB with Mongoose
- JWT authentication
- File upload support
- Error handling

## Setup Instructions

### Backend Setup
```bash
cd server
npm install
npm start
```

## Important Notes:

1. **Check `client/.gitignore`** - It should already exclude `node_modules/`
2. **Create `server/.gitignore`** if it doesn't exist:
   ```bash
   cd server
   echo "node_modules/" > .gitignore
   echo ".env" >> .gitignore
   echo "npm-debug.log*" >> .gitignore
   cd ..
