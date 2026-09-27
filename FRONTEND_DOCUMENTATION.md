# OrientCompanion — Frontend Technical Documentation

> **Version:** 1.0.0  
> **Framework:** React 19.x + Vite 8.x  
> **Routing:** React Router v7.x  
> **Target Audience:** Moroccan High School & University Students, Guidance Counselors, Platform Administrators.

---

## 📑 Table of Contents
1. [Overview & System Architecture](#1-overview--system-architecture)
2. [Technology Stack & Core Dependencies](#2-technology-stack--core-dependencies)
3. [Project Directory Structure](#3-project-directory-structure)
4. [Bootstrapping & Provider Hierarchy](#4-bootstrapping--provider-hierarchy)
5. [Routing & Role-Based Access Control (RBAC)](#5-routing--role-based-access-control-rbac)
6. [API & Authentication Layer](#6-api--authentication-layer)
7. [State Management (React Context Layer)](#7-state-management-react-context-layer)
8. [The AI Core: RIASEC Chatbot Engine](#8-the-ai-core-riasec-chatbot-engine)
9. [Portals & Feature Modules](#9-portals--feature-modules)
   - [9.1 Student Portal](#91-student-portal)
   - [9.2 Counselor Portal](#92-counselor-portal)
   - [9.3 Admin Portal](#93-admin-portal)
10. [Styling & Design System](#10-styling--design-system)
11. [Environment Setup & Build Commands](#11-environment-setup--build-commands)
12. [Troubleshooting & Common Issues](#12-troubleshooting--common-issues)

---

## 1. Overview & System Architecture

**OrientCompanion** is an educational and vocational orientation platform built specifically for the Moroccan higher education ecosystem (Baccalaureate tracks, CPGE, public universities, engineering schools like ENSIAS/EMI/INPT, business faculties like ENCG, and medical faculties).

The frontend operates as a Single Page Application (SPA) interacting with:
1. **Spring Boot Backend API**: Handles persistent user data, authentication, recommendations scoring, school listings, appointments, and community posts.
2. **Google Gemini Generative AI Service**: Directly powers conversational RIASEC personality assessments and profile classification.

### High-Level Architecture Flow

```
+-------------------------------------------------------------------------------+
|                                Browser Client                                 |
|                                                                               |
|  +-------------------------------------------------------------------------+  |
|  |                  React Root (main.jsx -> App.jsx)                       |  |
|  |   +-----------------------------------------------------------------+   |  |
|  |   |                Provider Tree (8 Context Providers)              |   |  |
|  |   |   +---------------------------------------------------------+   |   |  |
|  |   |   |                  AppRoutes (Router v7)                  |   |   |  |
|  |   |   |   +-------------------+  +---------------+  +-------+   |   |  |
|  |   |   |   | Student Portal    |  | Counselor     |  | Admin |   |   |  |
|  |   |   |   | (AppLayout)       |  | (Counselor..  |  | (Adm..|   |   |  |
|  |   |   |   +---------+---------+  +-------+-------+  +---+---+   |   |  |
|  +---|---|-------------|--------------------|--------------|-------|---+--+  |
+------|---|-------------|--------------------|--------------|-------|---------+
       |   |             |                    |              |       |
       |   +-------+     |                    |              |       |
       |           |     |                    |              |       |
       v           v     v                    v              v       v
 +------------+  +------------------------------------------------------+
 | Google     |  |                    Axios apiClient                   |
 | Gemini API |  |          (JWT Interceptor + Base URL Routing)         |
 | (REST AI)  |  +---------------------------+--------------------------+
 +------------+                              |
                                             v
                             +-------------------------------+
                             |    OrientCompanion Backend    |
                             |      (Spring Boot /api)       |
                             +-------------------------------+
```

---

## 2. Technology Stack & Core Dependencies

| Package | Version | Purpose |
|:---|:---|:---|
| **react** / **react-dom** | `^19.2.8` | Next-generation React engine with concurrent features. |
| **vite** | `^8.3.0` | Ultra-fast build tool and development server. |
| **react-router-dom** | `^7.18.3` | Client-side routing, nested routes, and route guards. |
| **axios** | `^1.20.0` | HTTP client with request/response interceptors. |
| **jwt-decode** | `^4.0.0` | Client-side decoding of JWT payload claims (`exp`, `sub`, `role`). |
| **react-hook-form** | `^7.88.0` | Performant form state management and submission. |
| **yup** | `^1.7.1` | Schema validation for user authentication and inputs. |
| **@google/genai** | `^2.22.0` | Google GenAI SDK for Gemini model integrations. |
| **oxlint** | `^1.81.0` | High-performance Rust-based linter. |

---

## 3. Project Directory Structure

```
OrientCompanion_front/
├── index.html                     # HTML5 entry shell with #root
├── package.json                   # Dependencies, scripts, and build metadata
├── vite.config.js                 # Vite bundler configuration
├── src/
│   ├── main.jsx                   # React DOM root attachment point
│   ├── App.jsx                    # Global context providers and theme initialization
│   ├── App.css                    # Global application styles & variables
│   ├── index.css                  # CSS reset and base typography
│   │
│   ├── api/                       # HTTP API client services
│   │   ├── apiClient.js           # Central Axios instance with interceptors
│   │   ├── AuthApi.js             # /auth/login and /auth/register
│   │   ├── assessmentApi.js       # /assessments endpoints
│   │   ├── recommendationApi.js   # /recommendations endpoints
│   │   ├── schoolApi.js           # /schools catalog endpoints
│   │   ├── fieldApi.js            # /fields academic paths
│   │   ├── mentorshipApi.js       # /mentorship programs & pairings
│   │   ├── CounselorApi.js        # /counselor sessions & slots
│   │   └── AdminApi.js            # /admin metrics, users, and settings
│   │
│   ├── chat/                      # Conversational AI Module
│   │   ├── RiasecAiChatbot.jsx    # Multi-turn RIASEC AI chatbot with Gemini
│   │   └── RiasecAiChatbot.css    # Responsive chat interface styling
│   │
│   ├── context/                   # React Context Providers
│   │   ├── AuthContext.jsx        # User authentication, tokens, and role state
│   │   ├── AssessmentContext.jsx  # Student evaluation results & submit actions
│   │   ├── RecommendationContext.jsx # Academic/career recommendations state
│   │   ├── SchoolContext.jsx      # Higher education institutions state
│   │   ├── FieldContext.jsx       # Educational branches and disciplines
│   │   ├── MentorshipContext.jsx  # Mentoring pairings and session requests
│   │   ├── CounselorContext.jsx   # Appointments and counselor-student dossiers
│   │   └── AdminContext.jsx       # Platform administration and telemetry
│   │
│   ├── layouts/                   # Role-specific layout shells
│   │   ├── AppLayout.jsx          # Student navigation bar, sidebar, and outlet
│   │   ├── CounselorLayout.jsx    # Counselor dashboard shell
│   │   ├── AdminLayout.jsx        # Admin side-panel and management container
│   │   ├── AppLayout.css          # Student layout rules
│   │   └── AdminLayout.css        # Admin layout rules
│   │
│   ├── routes/                    # Routing configuration & guards
│   │   ├── AppRoutes.jsx          # Route tree definition
│   │   └── ProtectedRoute.jsx     # Expiration check and role authorization guard
│   │
│   ├── forms/                     # Reusable forms
│   │   └── LoginForm.jsx          # Login inputs with validation
│   │
│   └── components/                # Page components and views
│       ├── auth/                  # Login and Register pages
│       ├── landing/               # OrientLandingPage public homepage
│       ├── pages/                 # StudentDashboard, RecommendationsPage, 404, Unauthorized
│       ├── School/                # StudentRecommendedSchools, School filters
│       ├── mentor/                # MentorshipManagement and connection cards
│       ├── board/                 # Community Board & discussion forum
│       ├── counselor/             # CounselorDashboard, Sessions, Students, Availability
│       └── admin/                 # AdminOverview, Users, Fields, Schools, Assessments
```

---

## 4. Bootstrapping & Provider Hierarchy

### Root Mounting (`main.jsx`)
```jsx
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

### Context Composition (`App.jsx`)
Contexts are nested to ensure child components have access to all domain stores without prop drilling:

```jsx
<BrowserRouter>
  <AuthProvider>
    <AssessmentProvider>
      <RecommendationProvider>
        <MentorshipProvider>
          <FieldProvider>
            <SchoolProvider>
              <AdminProvider>
                <CounselorProvider>
                  <ThemeInitializer />
                  <AppRoutes />
                </CounselorProvider>
              </AdminProvider>
            </SchoolProvider>
          </FieldProvider>
        </MentorshipProvider>
      </RecommendationProvider>
    </AssessmentProvider>
  </AuthProvider>
</BrowserRouter>
```

- **ThemeInitializer**: Checks `localStorage.getItem("orient_theme")` (defaults to `"light"`). Sets the HTML root attribute `data-theme`, enabling dynamic CSS variable theming.

---

## 5. Routing & Role-Based Access Control (RBAC)

The routing engine uses **Declarative Nested Layouts** and **Route Guards**.

### Route Map (`src/routes/AppRoutes.jsx`)

| Path | Allowed Roles | Layout Shell | Component |
|:---|:---|:---|:---|
| `/` | *Public* | None | `OrientLandingPage` |
| `/login` | *Public* | None | `LoginPage` |
| `/register` | *Public* | None | `RegisterPage` |
| `/dashboard` | `STUDENT`, `ADMIN` | `AppLayout` | `StudentDashboard` |
| `/assessment` | `STUDENT`, `ADMIN` | `AppLayout` | `CompleteAssessmentChatbot` |
| `/recommendations` | `STUDENT`, `ADMIN` | `AppLayout` | `RecommendationsPage` |
| `/StudentRecommendedSchools` | `STUDENT`, `ADMIN` | `AppLayout` | `StudentRecommendedSchools` |
| `/mentorship` | `STUDENT`, `ADMIN` | `AppLayout` | `MentorshipManagement` |
| `/board` | `STUDENT`, `ADMIN` | `AppLayout` | `Board` |
| `/counselor/*` | `COUNSELOR`, `ADMIN` | `CounselorLayout` | Counselor views (`Dashboard`, `Sessions`, `Students`, etc.) |
| `/admin/*` | `ADMIN` | `AdminLayout` | Admin views (`Overview`, `Users`, `Schools`, `Fields`, etc.) |
| `/unauthorized` | *Public* | None | `UnauthorizedPage` |
| `*` | *Public* | None | `NotFoundPage` |

### Guard Mechanism (`src/routes/ProtectedRoute.jsx`)
The guard executes in three sequential stages:
1. **Token Expiry Validation**: Uses `jwtDecode(token)` to inspect `decoded.exp`. If `decoded.exp < Date.now() / 1000`, it immediately fires `logout()` and redirects to `/login`.
2. **Authentication Verification**: If `!isAuthenticated || !token`, the user is redirected to `/login`, preserving `location` inside `state.from`.
3. **Role Authorization**: Compares `user.role` with `allowedRoles`. If the role is missing or not allowed, redirects to `/unauthorized`.
4. Renders `<Outlet />` if all criteria pass.

---

## 6. API & Authentication Layer

### Central HTTP Client (`src/api/apiClient.js`)
Configured with Axios to ensure uniform headers, timeouts, and security tokens:
```javascript
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api",
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});
```

#### Request Interceptor
Extracts the token from `localStorage` and appends standard HTTP Bearer authorization:
```javascript
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

#### Response Interceptor (Error Handling)
- **401 Unauthorized**: Automatically removes stored credentials and redirects to `/login?expired=true`.
- **403 Forbidden**: Logs permission denial without clearing the session.
- **Network Error**: Notifies of server reachability failures.

### Authentication Context (`src/context/AuthContext.jsx`)
Manages the user identity cycle:
- `login({ email, password })`: Calls `AuthApi.login`, extracts and decodes the JWT token, extracts `{ id, email, fullName, role }`, and synchronizes state with `localStorage`.
- `register(data)`: Dispatches registration payloads to `AuthApi.register`.
- `logout()`: Clears state variables and removes `token` and `user` keys from storage.

---

## 7. State Management (React Context Layer)

OrientCompanion follows a modular domain-driven context architecture:

### 1. `AssessmentContext` (`src/context/AssessmentContext.jsx`)
- **State**: `profile`, `loading`, `error`, `hasCompletedAssessment`.
- **Methods**:
  - `fetchProfile()`: Retrieves the current student's RIASEC scores from `/assessments/profile`. Handles 404 cleanly by keeping `profile = null`.
  - `submitAssessment(assessmentData)`: Posts the JSON payload generated by the chatbot to `/assessments/submit`.

### 2. `RecommendationContext` (`src/context/RecommendationContext.jsx`)
- **State**: `recommendations` (Array), `loading`, `error`.
- **Methods**:
  - `fetchMyRecommendations()`: Retrieves matching filières and career suggestions from `/recommendations/my`.
  - `regenerateRecommendations()`: Triggers backend re-scoring based on updated user marks or preferences.

### 3. `SchoolContext` (`src/context/SchoolContext.jsx`)
- **State**: `schools`, `filteredSchools`, `selectedSchool`, `filters`.
- **Methods**: Fetches and filters educational institutions by city, public/private status, and competitive exam requirements (concours).

### 4. `CounselorContext` (`src/context/CounselorContext.jsx`)
- **State**: `sessions`, `students`, `availabilitySlots`, `stats`.
- **Methods**: Handles scheduling, status updates (CONFIRMED, COMPLETED, CANCELLED), and counselor evaluation reviews.

### 5. `AdminContext` (`src/context/AdminContext.jsx`)
- **State**: `users`, `stats`, `fields`, `schools`, `auditLogs`.
- **Methods**: Full administrative CRUD operations across user roles, university listings, and academic thresholds.

---

## 8. The AI Core: RIASEC Chatbot Engine

The conversational orientation module in [src/chat/RiasecAiChatbot.jsx](file:///C:/Users/hamza2004/Bureau/OrientCompanion_front/src/chat/RiasecAiChatbot.jsx) acts as a virtual Moroccan academic counselor ("*Companion Orient*").

### Evaluation Workflow

```
+-------------------------------------------------------------+
| Student enters /assessment                                  |
+------------------------------+------------------------------+
                               |
                               v
+-------------------------------------------------------------+
| Bot Turn 1: Greets student, asks Bac branch + key grades     |
+------------------------------+------------------------------+
                               | Student replies with grades
                               v
+-------------------------------------------------------------+
| Bot Turn 2: Asks single targeted work preference question   |
+------------------------------+------------------------------+
                               | Student replies with interest
                               v
+-------------------------------------------------------------+
| Bot Turn 3 (Final): Concludes warmly & outputs hidden JSON  |
| - Personality Scores (R, I, A, S, E, C from 0 to 100)       |
| - Academic Scores (Maths, Info, PC, etc. from 0 to 20)      |
| - Interest Scores (0 to 100)                                |
+------------------------------+------------------------------+
                               |
                               v
+-------------------------------------------------------------+
| Frontend Regex Parser extracts ```json block                |
| 1. cleanBotResponse() presents conversational text to user  |
| 2. JSON.parse() deserializes structured payload             |
| 3. AssessmentContext.submitAssessment(data) persists data   |
| 4. Auto-redirect to /recommendations                        |
+-------------------------------------------------------------+
```

### The System Prompt & Schema Contract
The prompt strictly constrains Gemini (`gemini-3.6-flash`):
- Kept to 1-2 sentence replies (< 40 words) for speed.
- Finishes within 2-3 turns.
- Injects inferred scores into a strictly formatted JSON markdown code block:
```json
{
  "isFinished": true,
  "assessmentData": {
    "personalityScores": { "R": 85, "I": 90, "A": 30, "S": 55, "E": 65, "C": 50 },
    "academicScores": { "Mathématiques": 17, "Informatique": 18, "Physique": 15 },
    "interests": { "Informatique": 95, "Mathématiques": 85, "Réseaux": 70 }
  }
}
```

### Direct Gemini API Call (`callGeminiDirect`)
Calls Google's endpoint directly using `import.meta.env.VITE_GEMINI_API_KEY`:
```
https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}
```
This architecture delivers instant conversational streaming without imposing heavy WebSocket overhead on the Spring Boot backend.

---

## 9. Portals & Feature Modules

### 9.1 Student Portal
- **Dashboard (`StudentDashboard.jsx`)**: The personal command center. Displays whether the assessment is done, the dominant RIASEC traits (e.g. *Investigateur / Réaliste*), quick stats, and recommended next steps.
- **Recommendations (`RecommendationsPage.jsx`)**: Displays calculated recommendations. Features affinity scores (e.g., 92% Match with Software Engineering), career descriptions, and lists of Moroccan schools offering the program.
- **Recommended Schools (`StudentRecommendedSchools.jsx`)**: Filterable directory of universities matching the student's academic profile and geographic preferences.
- **Mentorship (`MentorshipManagement.jsx`)**: Connects high schoolers with current university students for guidance and questions.
- **Board (`Board.jsx`)**: Interactive post feed for community questions, experiences, and advice.

### 9.2 Counselor Portal
- **Dashboard (`CounselorDashboard.jsx`)**: Displays upcoming student appointments, recent reviews, and key guidance indicators.
- **Sessions (`CounselorSessions.jsx`)**: Interactive list to manage, approve, or reschedule orientation video calls and face-to-face meetings.
- **Students (`CounselorStudents.jsx`)**: Detailed student files where counselors can review academic grades, RIASEC radar scores, and write personalized recommendations.
- **Availability (`CounselorAvailability.jsx`)**: Configurable weekly time slots for student reservations.

### 9.3 Admin Portal
- **Overview (`AdminOverview.jsx`)**: High-level platform KPIs: total active students, counselors, assessments completed, and system health.
- **User Management (`AdminUsers.jsx`)**: Tabular view of all registered accounts. Supports role promotion, password resets, and account suspension.
- **Schools & Fields (`AdminSchools.jsx`, `AdminFields.jsx`)**: Content management interface for adding, updating, or archiving educational institutions, requirements, and sectors.

---

## 10. Styling & Design System

The application relies on standard CSS modules and global CSS variables without third-party utility bloat:
- **Global Tokens (`src/App.css` & `src/index.css`)**:
  - Color palette: Modern slate, indigo, and emerald palette (`--primary`, `--primary-hover`, `--bg-color`, `--card-bg`, `--text-main`, `--text-muted`).
  - Dark/Light Theme: Controlled via `[data-theme="dark"]` attribute on `document.documentElement`.
- **Layout Sheets**:
  - `AppLayout.css`: Responsive grid sidebar, top navigation, and main content area.
  - `AdminLayout.css`: Fixed sidebar for management views.
  - `RiasecAiChatbot.css`: Mobile-first chat bubbles, typing indicators, step progression badges, and completion score cards.

---

## 11. Environment Setup & Build Commands

### Configuration File (`.env`)
Create a `.env` file in the project root:
```env
# URL to the Spring Boot REST API
VITE_API_BASE_URL=http://localhost:8080/api

# Google AI Studio / Gemini API Key
VITE_GEMINI_API_KEY=AIzaSy...your_gemini_api_key
```

### Installation & Run Scripts

```bash
# 1. Install dependencies
npm install

# 2. Run local development server (Vite on http://localhost:5173)
npm run dev

# 3. Code quality inspection (Fast Rust linter)
npm run lint

# 4. Compile and bundle for production
npm run build

# 5. Preview production build locally
npm run preview
```

---

## 12. Troubleshooting & Common Issues

### 1. Token Expiry Loop / Immediate Logout
- **Cause**: The JWT token generated by the backend has an expiration timestamp (`exp`) that has passed, or the local machine's clock is out of sync.
- **Fix**: Check `isTokenExpired()` in `src/routes/ProtectedRoute.jsx`. Confirm backend JWT lifetime settings (e.g., `jwt.expiration` in Spring Boot `application.properties`).

### 2. "Clé API Gemini introuvable" Error in Chatbot
- **Cause**: The environment variable `VITE_GEMINI_API_KEY` is undefined or not prefixed with `VITE_`.
- **Fix**: Ensure the `.env` file is in the project root (alongside `package.json`) and restart the Vite development server (`npm run dev`) to reload environment variables.

### 3. Network Error / Server Unreachable (Axios)
- **Cause**: The Spring Boot backend is either not running or CORS is blocking the request.
- **Fix**:
  1. Ensure the backend is listening on `http://localhost:8080`.
  2. Confirm Spring Security CORS configuration allows `http://localhost:5173` with headers `Authorization` and `Content-Type`.

### 4. 403 Forbidden on Role-Specific Pages
- **Cause**: The authenticated user's role in the JWT token does not match the `allowedRoles` defined in `src/routes/AppRoutes.jsx`.
- **Fix**: Verify user roles in the database. Valid values are `STUDENT`, `COUNSELOR`, and `ADMIN`.
