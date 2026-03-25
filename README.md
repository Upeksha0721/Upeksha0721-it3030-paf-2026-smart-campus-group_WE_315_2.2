# Upeksha0721-it3030-paf-2026-s# 🏫 Smart Campus Operations Hub
**IT3030 – Programming Applications & Frameworks | Group WE_315_2.2**

## 👥 Team Members
| Member | Index No | Modules |
|--------|----------|---------|
| Upeksha| IT23745506 | Auth Service, Notifications, OAuth2, Role Management |
| ruwandi | IT23740174 | Facility & Assets Catalogue |
| jayani| IT23646674 | Booking Management |
| Diyana | IT23678668 | Incident & Maintenance Ticketing |

## 🛠️ Tech Stack
- **Backend:** Java 17, Spring Boot 3, Spring Security, OAuth2 (Google)
- **Frontend:** React 18, Vite, Axios, React Router
- **Database:** MySQL 8
- **Architecture:** Microservices
- **CI/CD:** GitHub Actions

## 🌿 Branch Strategy
| Branch | Purpose |
|--------|---------|
| `main` | Production ready — PR only |
| `develop` | Integration branch |
| `feature/auth-notification` | Upeksha (Leader) |
| `feature/facility-service` | Member 2 |
| `feature/booking-service` | Member 3 |
| `feature/incident-service` | Member 4 |

## 🚀 How to Run Locally

### Prerequisites
- Java 17+
- Node.js 20+
- MySQL 8+
- Maven 3.8+

### 1. Clone the repo
```bash
git clone https://github.com/Upeksha0721/Upeksha0721-it3030-paf-2026-smart-campus-group_WE_315_2.2.git
cd Upeksha0721-it3030-paf-2026-smart-campus-group_WE_315_2.2
```

### 2. Start each backend service
```bash
cd backend/auth-service
mvn spring-boot:run
```

### 3. Start frontend
```bash
cd frontend
npm install
npm run dev
```

## 📋 API Documentation
See [`docs/api-endpoints.md`](docs/api-endpoints.md)

## ✅ CI/CD Pipeline
GitHub Actions runs automatically on every push to `main` and `develop`.
Workflow: `.github/workflows/ci.yml`mart-campus-group_WE_315_2.2