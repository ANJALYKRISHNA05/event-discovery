# 🌐 EventPulse — Global Event Discovery Platform

> A modern, full-stack platform for discovering international business conferences, trade expos, tech summits, and industrial exhibitions, with comprehensive administrative CRUD management, multi-criteria filtering, and RESTful APIs.

---

## 📸 Overview & Features

**EventPulse** is built to deliver an exceptional UI/UX experience and robust CRUD functionality:

1. **Event Discovery Page (`/`)**:
   - **Rich Hero Section**: Dynamic tagline badge, headline, and popular category pills.
   - **Search & Multi-Facet Filtering**: Real-time debounced keyword search, category, industry, city, country, and live status (Upcoming, Ongoing, Completed) filters.
   - **Flexible Layouts**: Instant switch between Responsive Card Grid and Compact List view.
   - **Micro-Interactions**: Card hover glow transitions, live status indicators, bookmark toggle (with local persistence), and copy-link share toasts.
   - **Empty & Loading States**: Skeleton loaders during network requests and friendly empty states with a 1-click filter reset.

2. **Event Details Page (`/events/:id`)**:
   - High-contrast banner with category and status badges.
   - Comprehensive metadata grid (Start/End dates, Schedule breakdown, Venue, City, Country, Industry).
   - Rich Description and "What to Expect" highlight points.
   - Verified Organizer card with direct website link.
   - Interactive **Add to Calendar** (.ics download and Google Calendar integration).
   - **Related Events** recommendation strip based on category and industry tags.

3. **Admin Management Hub (`/admin`)**:
   - **Live KPI Metric Cards**: Real-time counts for Total Events, Upcoming, Ongoing, Destinations/Cities, and Top Category.
   - **Management Data Table**: Search and filter table data on the fly.
   - **Create / Edit Event Modal**:
     - Form sections: Basic Info, Schedule & Status, Location & Venue, Organizer & Media.
     - Live banner image preview with **Curated Banner Presets Picker**.
     - Real-time client-side and server-side Zod validation.
   - **Delete Confirmation Modal**: Accessible safety dialog with danger alerts before permanent deletion.
   - **1-Click Demo Reset**: Re-seed database with 12 sample international events at any time.

4. **REST API**:
   - Full RESTful endpoints with Zod validation, HTTP status codes, pagination, and search/filter query parameters.

---

## 🛠️ Technology Stack

| Layer | Technology | Details |
| :--- | :--- | :--- |
| **Framework** | Next.js 16 (App Router) | Server & Client components, Turbopack, Route Handlers |
| **Language** | TypeScript | Full end-to-end static type safety |
| **Styling & UI** | Tailwind CSS + Custom CSS | Modern dark glassmorphism, sleek scrollbars, vibrant badges |
| **Database** | Neon Serverless PostgreSQL + Prisma ORM | Production-grade cloud database with connection pooling |
| **Validation** | Zod | Strong schema validation on API routes and forms |
| **Icons & Alerts**| Lucide React + Sonner | Modern iconography and animated toast notifications |
| **Testing** | Node.js Test Suite | Automated end-to-end API test runner (`npm test`) |

---

## 📂 Project Structure

```text
event-discovery/
├── app/
│   ├── admin/
│   │   └── page.tsx              # Admin Management Hub (KPIs, Table, CRUD)
│   ├── api/
│   │   ├── events/
│   │   │   ├── route.ts          # GET (list/filter/paginate) & POST (create)
│   │   │   └── [id]/
│   │   │       └── route.ts      # GET (single), PUT (update), DELETE (delete)
│   │   ├── seed/
│   │   │   └── route.ts          # POST (reset & re-seed database)
│   │   └── stats/
│   │       └── route.ts          # GET (admin dashboard analytics)
│   ├── events/
│   │   └── [id]/
│   │       └── page.tsx          # Public Event Details Page
│   ├── globals.css               # Global theme tokens, glassmorphism & gradients
│   ├── layout.tsx                # Root layout with Toast provider & SEO metadata
│   └── page.tsx                  # Public Event Discovery Home Page
├── components/
│   ├── CalendarExport.tsx        # .ics file download & Google Calendar helper
│   ├── DeleteConfirmModal.tsx    # Danger confirmation dialog
│   ├── EventCard.tsx             # Interactive Event Card (Grid & List views)
│   ├── EventModal.tsx            # Create & Edit Event modal form
│   ├── FilterBar.tsx             # Real-time search & multi-facet filter bar
│   ├── Footer.tsx                # Platform footer with tech stack specs
│   └── Navbar.tsx                # Glassmorphic top navigation & mobile menu
├── lib/
│   ├── prisma.ts                 # Prisma ORM client singleton
│   ├── types.ts                  # TypeScript interfaces and types
│   ├── utils.ts                  # Date formatters, status styles, presets
│   └── validators.ts             # Zod validation schema
├── prisma/
│   ├── schema.prisma             # Database schema definition
│   └── seed.ts                   # 12 diverse international sample events
├── .env                          # Local environment variables
├── .env.example                  # Environment variables template
├── test-e2e.mjs                  # Automated test suite (30 assertions)
└── package.json
```

---

## 🚀 Quick Start Setup Instructions

### Prerequisites
- Node.js (v18+ recommended)
- npm (v9+ recommended)

### 1. Clone & Install Dependencies
```bash
git clone <repository-url>
cd event-discovery
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env` (already configured for zero-config SQLite):
```bash
cp .env.example .env
```

`.env` content:
```env
DATABASE_URL="file:./dev.db"
```

### 3. Initialize & Seed Database
Run Prisma migrations and seed the initial dataset:
```bash
npm run db:push
npm run db:seed
```

### 4. Start the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Running Automated Tests

A comprehensive end-to-end test suite tests all REST API endpoints, validation logic, search/filters, and CRUD mutations:

```bash
npm test
```

**Results:**
```text
🚀 Starting Comprehensive API & Flow Tests...
  ✅ [PASS] GET /api/events returns HTTP 200
  ✅ [PASS] Response has success=true
  ✅ [PASS] Returned 6 events
  ✅ [PASS] Search by keyword returns 200
  ✅ [PASS] Filter by Category + Status returns 200
  ✅ [PASS] GET /api/stats returns 200
  ✅ [PASS] POST /api/events returns HTTP 201 Created
  ✅ [PASS] GET /api/events/:id returns HTTP 200
  ✅ [PASS] PUT /api/events/:id returns HTTP 200
  ✅ [PASS] Invalid payload returns HTTP 400 Bad Request
  ✅ [PASS] DELETE /api/events/:id returns HTTP 200
  ✅ [PASS] Deleted event now returns HTTP 404 Not Found
  ✅ [PASS] POST /api/seed returns HTTP 200
=============================================
🎉 TEST SUMMARY: 30 PASSED, 0 FAILED
=============================================
```

---

## 🗄️ Database Schema Design

The `Event` model is defined in `prisma/schema.prisma` with indexes for high-performance filtering:

```prisma
model Event {
  id          String   @id @default(cuid())
  name        String
  description String
  category    String
  industry    String
  startDate   DateTime
  endDate     DateTime
  venue       String
  city        String
  country     String
  organizer   String
  website     String
  image       String
  status      String   @default("UPCOMING") // UPCOMING, ONGOING, COMPLETED
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([category])
  @@index([industry])
  @@index([city])
  @@index([country])
  @@index([status])
  @@index([startDate])
}
```

---

## 📡 REST API Documentation

### 1. `GET /api/events`
Retrieve events with search, filtering, sorting, pagination, and dynamic facets.

**Query Parameters:**
| Parameter | Type | Description |
| :--- | :--- | :--- |
| `search` | `string` | Search query across name, description, venue, city, country, organizer |
| `category` | `string` | Filter by category (e.g. `Technology`, `Healthcare`) |
| `industry` | `string` | Filter by industry (e.g. `AI & Robotics`, `FinTech`) |
| `city` | `string` | Filter by city (e.g. `San Francisco`, `London`, `Dubai`) |
| `country` | `string` | Filter by country (e.g. `United States`, `United Kingdom`) |
| `status` | `string` | Filter by status (`UPCOMING`, `ONGOING`, `COMPLETED`) |
| `sortBy` | `string` | Sort field: `startDate`, `name`, `createdAt` (default: `startDate`) |
| `sortOrder` | `string` | `asc` or `desc` (default: `asc`) |
| `page` | `number` | Page number (default: `1`) |
| `limit` | `number` | Items per page (default: `12`) |

**Sample Response (`200 OK`):**
```json
{
  "success": true,
  "events": [
    {
      "id": "cme01...",
      "name": "Global AI & Neural Summit 2026",
      "description": "The premier international forum for artificial intelligence researchers...",
      "category": "Technology",
      "industry": "AI & Robotics",
      "startDate": "2026-10-15T09:00:00.000Z",
      "endDate": "2026-10-17T18:00:00.000Z",
      "venue": "Moscone Convention Center, South Hall",
      "city": "San Francisco",
      "country": "United States",
      "organizer": "Nexus Frontier Tech Alliance",
      "website": "https://globalsummit.ai",
      "image": "https://images.unsplash.com/photo-1540575467063-178a50c2df87",
      "status": "UPCOMING",
      "createdAt": "2026-09-23T11:00:00.000Z",
      "updatedAt": "2026-09-23T11:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 12,
    "page": 1,
    "limit": 12,
    "totalPages": 1
  },
  "facets": {
    "categories": [{ "name": "Technology", "count": 3 }],
    "industries": [{ "name": "AI & Robotics", "count": 2 }],
    "cities": [{ "name": "San Francisco", "count": 1 }],
    "countries": [{ "name": "United States", "count": 3 }],
    "statuses": [{ "name": "UPCOMING", "count": 8 }]
  }
}
```

---

### 2. `GET /api/events/:id`
Fetch single event details along with related event recommendations.

**Sample Response (`200 OK`):**
```json
{
  "success": true,
  "event": {
    "id": "cme01...",
    "name": "Global AI & Neural Summit 2026",
    "category": "Technology",
    "status": "UPCOMING"
  },
  "relatedEvents": [ ... ]
}
```

---

### 3. `POST /api/events`
Create a new event. Validated with Zod schema.

**Request Payload:**
```json
{
  "name": "World HealthTech Congress 2026",
  "description": "Annual international gathering of digital health and MedTech innovators.",
  "category": "Healthcare",
  "industry": "Biotechnology & MedTech",
  "startDate": "2026-11-04T08:30:00Z",
  "endDate": "2026-11-06T17:30:00Z",
  "venue": "ExCeL London",
  "city": "London",
  "country": "United Kingdom",
  "organizer": "BioGlobal Network",
  "website": "https://healthtechcongress.org",
  "image": "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d",
  "status": "UPCOMING"
}
```

**Response:** `201 Created` with created event object.

---

### 4. `PUT /api/events/:id`
Update an existing event. Validated with Zod schema.

**Response:** `200 OK` with updated event object.

---

### 5. `DELETE /api/events/:id`
Delete an event permanently.

**Response (`200 OK`):**
```json
{
  "success": true,
  "message": "Event \"Global AI & Neural Summit 2026\" successfully deleted."
}
```

---

### 6. `GET /api/stats`
Admin dashboard KPI summary metrics.

**Sample Response (`200 OK`):**
```json
{
  "success": true,
  "stats": {
    "totalEvents": 12,
    "upcomingCount": 8,
    "ongoingCount": 2,
    "completedCount": 2,
    "uniqueCities": 12,
    "uniqueCountries": 9,
    "topCategory": "Technology"
  }
}
```

---

### 7. `POST /api/seed`
Reset and re-seed the database on demand.

**Response (`200 OK`):**
```json
{
  "success": true,
  "message": "Database successfully re-seeded with 12 curated events!",
  "count": 12
}
```

---

## 🤖 AI Tools Used
In compliance with assessment guidelines, AI assistance was leveraged for:
- Accelerated architecture design and boilerplate bootstrapping.
- Crafting diverse, realistic seed data spanning international trade expos.
- Formulating the comprehensive E2E test suite.

All code, data flow, Prisma schemas, and React components were designed, inspected, and verified to ensure high code quality and maintainability.

---

## 🌟 Known Limitations & Future Roadmap
- **User Authentication / RBAC**: Current implementation provides open admin access for demonstration simplicity. Next step: integrate NextAuth.js or Clerk with role-based permissions (Admin vs Public attendee).
- **Interactive Mapbox/Leaflet**: Currently features venue location indicators; full interactive Mapbox coordinates embedding can be attached in the next release.
- **Ticketing & Payments**: Direct Stripe payment checkout for conference delegate passes.
