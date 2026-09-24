# Architecture Documentation — OrientCompanion Frontend

This document details the architectural design, structural patterns, data flows, and security boundaries of the **OrientCompanion** frontend web application.

---

## 1. High-Level Architectural Paradigm

OrientCompanion is built as a **Single Page Application (SPA)** using **React 19** and bundled with **Vite 8**. The application follows a layered, component-driven architecture with centralized Context-based state management and a decoupled API client layer.

```mermaid
graph TD
    subgraph Client ["Frontend Architecture (Browser Runtime)"]
        UI["Presentation Layer<br/>(Pages, Layouts, Components)"]
        Router["Routing & Guard Layer<br/>(React Router v7 + ProtectedRoute)"]
        State["State Management Layer<br/>(React Context API Hierarchy)"]
        Services["API & Service Client Layer<br/>(Axios Client + Domain APIs)"]
    end

    subgraph External ["External Services"]
        Backend["Spring Boot REST API<br/>(localhost:8080/api)"]
        Gemini["Google Gemini AI Engine<br/>(@google/genai SDK)"]
    end

    UI --> Router
    Router --> State
    State --> Services
    Services --> Backend
    UI -.->|Direct AI Conversation| Gemini
```

---

## 2. Layered System Architecture

The application is structured into five distinct operational layers:

```mermaid
flowchart TD
    subgraph L1 ["1. Presentation Layer"]
        PublicViews["Public Views<br/>Landing Page, Login, Register"]
        StudentViews["Student Views<br/>Dashboard, RIASEC Chat, Recommendations, Schools"]
        CounselorViews["Counselor Views<br/>Sessions, Dossiers, Availability, Reviews"]
        AdminViews["Admin Views<br/>Overview, Users, Fields, Schools, Mentorship"]
    end

    subgraph L2 ["2. Layout & Shell Layer"]
        AppLayout["AppLayout.jsx & StudentNavbar.jsx"]
        CounselorLayout["CounselorLayout.jsx (Sidebar Shell)"]
        AdminLayout["AdminLayout.jsx (Sidebar Shell)"]
    end

    subgraph L3 ["3. Routing & Security Layer"]
        AppRoutes["AppRoutes.jsx (Route Map)"]
        ProtectedRoute["ProtectedRoute.jsx (RBAC Guard)"]
    end

    subgraph L4 ["4. State & Context Layer"]
        AuthCtx["AuthContext"]
        AssessCtx["AssessmentContext"]
        RecCtx["RecommendationContext"]
        MentorCtx["MentorshipContext"]
        SchoolCtx["SchoolContext"]
        FieldCtx["FieldContext"]
    end

    subgraph L5 ["5. Infrastructure & Service Layer"]
        AxiosClient["apiClient.js (Interceptors & Tokens)"]
        DomainAPIs["AuthApi, AssessmentApi, CounselorApi, AdminApi, SchoolApi..."]
        LocalStorage["Browser LocalStorage (Tokens, User, Theme)"]
    end

    PublicViews --> AppRoutes
    StudentViews --> AppLayout
    CounselorViews --> CounselorLayout
    AdminViews --> AdminLayout

    AppLayout --> AppRoutes
    CounselorLayout --> AppRoutes
    AdminLayout --> AppRoutes

    AppRoutes --> ProtectedRoute
    ProtectedRoute --> AuthCtx

    L1 -.-> L4
    L4 --> L5
    L5 --> LocalStorage
```

---

## 3. Component Hierarchy & Provider Nesting

All global providers are mounted in `src/App.jsx` in a strict dependency sequence:

```mermaid
graph TD
    A["main.jsx (StrictMode, root.render)"]
    B["App.jsx (BrowserRouter)"]
    C["SchoolProvider"]
    D["FieldProvider"]
    E["MentorshipProvider"]
    F["RecommendationProvider"]
    G["AssessmentProvider"]
    H["AuthProvider"]
    I["ThemeInitializer (data-theme sync)"]
    J["AppRoutes.jsx"]

    A --> B
    B --> C
    C --> D
    D --> E
    E --> F
    F --> G
    G --> H
    H --> I
    H --> J
```

### Provider Responsibilities

| Context Provider | Responsibility | Source File |
| :--- | :--- | :--- |
| **`AuthProvider`** | Manages JWT token lifecycle, user metadata, role resolution, and login/logout handlers. | `src/context/AuthContext.jsx` |
| **`AssessmentProvider`** | Stores current RIASEC evaluation results, student answers, and test completion state. | `src/context/AssessmentContext.jsx` |
| **`RecommendationProvider`**| Manages matching scores, filtered career suggestions, and priority school lists. | `src/context/RecommendationContext.jsx` |
| **`MentorshipProvider`** | Handles mentor listings, slot availability, session bookings, and history. | `src/context/MentorshipContext.jsx` |
| **`SchoolProvider`** | Provides catalog of Moroccan higher education institutions, thresholds, and entrance criteria. | `src/context/SchoolContext.jsx` |
| **`FieldProvider`** | Provides academic fields, specialties (*filières*), and degree tracks. | `src/context/FieldContext.jsx` |

---

## 4. Routing & Role-Based Access Control (RBAC)

The routing architecture in `src/routes/AppRoutes.jsx` enforces role-based navigation guards using `src/routes/ProtectedRoute.jsx`.

```mermaid
flowchart TD
    Req["Incoming Route Request"] --> IsAuth{"Is Authenticated?<br/>(token in AuthContext)"}

    IsAuth -- No --> RedirectLogin["Redirect to /login<br/>(Preserves location state)"]
    IsAuth -- Yes --> CheckRole{"User Role in allowedRoles?"}

    CheckRole -- No --> RedirectUnauth["Redirect to /unauthorized"]
    CheckRole -- Yes --> RenderRoute["Render Layout & &lt;Outlet /&gt;"]
```

### Route Segmentation Matrix

| Path Scope | Allowed Roles | Layout Shell | Key Components |
| :--- | :--- | :--- | :--- |
| `/` | *Public* | None | `OrientLandingPage.jsx` |
| `/login`, `/register` | *Public* | None | `Login.jsx`, `RegisterPage.jsx` |
| `/dashboard`, `/assessment`, `/recommendations`, `/mentorship`, `/StudentRecommendedSchools`, `/board` | `STUDENT`, `ADMIN` | `AppLayout.jsx` & `StudentNavbar.jsx` | `Board.jsx`, `RiasecAiChatbot.jsx`, `RecommendationsPage.jsx` |
| `/counselor/*` | `COUNSELOR`, `ADMIN` | `CounselorLayout.jsx` | `CounselorDashboard.jsx`, `CounselorSessions.jsx` |
| `/admin/*` | `ADMIN` | `AdminLayout.jsx` | `AdminOverview.jsx`, `AdminUsers.jsx`, `AdminSchools.jsx` |

---

## 5. Service & Communication Architecture

### Centralized Axios Client (`src/api/apiClient.js`)

All communications with the backend REST server go through a centralized Axios instance:

1. **Base URL Resolution**: Configured via `import.meta.env.VITE_API_BASE_URL` with a fallback to `http://localhost:8080/api`.
2. **Request Interceptor**: Automatically inspects `localStorage` for `token` and injects the header:
   ```http
   Authorization: Bearer <jwt-token>
   ```
3. **Response Interceptor (Session Expiry Guard)**:
   - Catches `401 Unauthorized` responses.
   - Purges `token` and `user` from `localStorage`.
   - Forces a clean client-side redirect to `/login?expired=true`.

### Domain API Modules

```
src/api/
├── apiClient.js          # Shared Axios instance with interceptors
├── AuthApi.js            # POST /auth/login, POST /auth/register
├── assessmentApi.js      # GET /assessments, POST /assessments/submit
├── recommendationApi.js  # GET /recommendations, POST /recommendations/calculate
├── mentorshipApi.js      # GET /mentors, POST /sessions/book
├── schoolApi.js          # GET /schools, POST/PUT/DELETE /admin/schools
├── fieldApi.js           # GET /fields, POST/PUT/DELETE /admin/fields
├── CounselorApi.js       # GET /counselor/sessions, PUT /counselor/availability
└── AdminApi.js           # GET /admin/stats, GET /admin/users
```

---

## 6. AI Integration Architecture (RIASEC Chatbot)

The RIASEC assessment engine (`src/chat/RiasecAiChatbot.jsx`) operates as an AI conversational agent:

```mermaid
sequenceDiagram
    autonumber
    actor Student as Student (Browser)
    participant UI as RiasecAiChatbot.jsx
    participant Gemini as Google GenAI SDK (@google/genai)
    participant Context as AssessmentContext
    participant Backend as Backend API (/api/assessments)

    Student->>UI: Types responses about interests, grades, and Bac branch
    UI->>Gemini: Prompts Gemini 2.x with conversation history + SYSTEM_INSTRUCTION
    Gemini-->>UI: Returns counselor response (French)
    Note over UI,Gemini: Multi-turn discovery loop (5 to 7 turns)
    Gemini-->>UI: Final response containing structured JSON block: { isFinished: true, assessmentData: { ... } }
    UI->>UI: Regex parser extracts JSON payload
    UI->>Context: Dispatches parsed scores (R, I, A, S, E, C + Academic grades)
    UI->>Backend: Persists assessment results via assessmentApi.js
    UI->>Student: Redirects to /recommendations
```

---

## 7. Theming Architecture

The application implements a zero-flicker dual theme engine (*Light* and *Dark* modes):

1. **CSS Variable Strategy** (`src/index.css`): Color tokens (`--canvas-bg`, `--text-primary`, `--accent-blue`, `--dash-card-bg`, etc.) are declared on `:root, [data-theme="light"]` and overridden under `[data-theme="dark"]`.
2. **DOM Attribution**: Theme is applied via `<html data-theme="...">` or `<div data-theme="...">`.
3. **Persistence & Synchronization**:
   - Persisted in `localStorage` under key `orient_theme`.
   - Synchronized across parallel components via the custom browser event:
     ```js
     window.dispatchEvent(new CustomEvent("orient_theme_change", { detail: nextTheme }));
     ```
   - Initialized before paint by `ThemeInitializer` in `src/App.jsx`.

---

## 8. Build & Deployment Architecture

```mermaid
flowchart LR
    Dev["Source Code<br/>(src/**/*.jsx, CSS)"] --> Vite["Vite 8 Compiler<br/>(Rollup Bundler)"]
    Vite --> Dist["dist/<br/>Static Assets (HTML, JS, CSS)"]
    Dist --> Docker["Docker Multi-Stage Build<br/>(Dockerfile)"]
    Docker --> Nginx["Production Nginx Web Server<br/>(nginx.conf - Port 80)"]
    Nginx --> Browser["Client Browser"]
```

- **Build Tool**: Vite 8 with `@vitejs/plugin-react`.
- **Production Asset Output**: Minified bundles in `/dist`.
- **Server Deployment**:
  - `Dockerfile`: Multi-stage build (Node alpine for build -> Nginx alpine for serving).
  - `nginx.conf`: Configured with `try_files $uri $uri/ /index.html` to support client-side HTML5 history routing.
  - `docker-compose.yml`: Container orchestration for web container deployment.
