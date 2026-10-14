# SkillConnect

A skill-based social networking platform for students.

## Features
- JWT authentication
- Student profiles, skills, and projects
- Posts, likes, and comments
- User search and connections
- Notifications and admin management

## Tech Stack
- React and Vite
- Java 21 and Spring Boot
- Spring Security and JWT
- MySQL

## Run Locally
1. Create the MySQL database: `CREATE DATABASE skillconnect;`
2. Configure database credentials in `src/main/resources/application.properties`.
3. Set your JWT secret: `export JWT_SECRET="$(openssl rand -base64 32)"`
4. Start the backend: `./mvnw spring-boot:run`
5. In another terminal, run `cd frontend && cp .env.example .env && npm install && npm run dev`.

## Author
Saniya Gautam
