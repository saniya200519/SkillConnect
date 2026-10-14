cat > README.md <<'EOF'
# SkillConnect

SkillConnect is a skill-based social networking platform that helps
students showcase their skills and projects, share posts, and connect
with peers.

## Features

- User registration, login, and profiles
- Skills and project management
- Social feed with posts, likes, and comments
- Search and connection requests
- Notifications
- Admin management

## Technology Stack

**Frontend:** React, Vite, JavaScript, CSS  
**Backend:** Java 21, Spring Boot, Spring Security, JWT  
**Database:** MySQL  
**API Testing:** Postman

## Project Structure

- `frontend/` — React frontend
- `src/main/java/` — Spring Boot backend
- `src/main/resources/application.properties` — backend configuration
- `pom.xml` — Maven dependencies

## Prerequisites

- Java 21
- MySQL
- Node.js and npm

## Run the Backend

1. Create a MySQL database named `skillconnect`.
2. Configure your local database credentials in
   `src/main/resources/application.properties`.
3. Set the JWT secret in your terminal:

   ```bash
   export JWT_SECRET="$(openssl rand -base64 32)"
   ```

4. Start the backend:

   ```bash
   ./mvnw spring-boot:run
   ```

The backend uses port `8080` by default.

## Run the Frontend

Open another terminal:

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

The frontend uses the API base URL configured in `frontend/.env`.

## Build Checks

Backend compilation:

```bash
./mvnw clean compile
```

Frontend checks:

```bash
cd frontend
npm run lint
npm run build
```

## Security Notes

- Keep database passwords and JWT secrets out of Git.
- Use secure production configuration before deployment.
- Protected API operations require authentication.

## Project Status

Developed as a student project to practise full-stack web development
with React, Spring Boot, REST APIs, JWT authentication, and MySQL.
EOF

git add README.md
git diff --cached --check
git commit -m "Add project README"
git push origin main
