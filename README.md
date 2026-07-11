# GearUp API 🏋️

**"Rent Sports & Outdoor Gear Instantly"**

GearUp is a backend REST API for a sports and outdoor equipment rental platform. Customers can browse gear, place rental orders, and pay online via Stripe. Providers manage their own gear inventory and fulfill incoming orders. Admins oversee users, listings, and rentals across the platform.

---

## 📖 API Documentation

Full endpoint reference (requests, responses, auth requirements) is available here:

👉 [Postman Documentation](https://documenter.getpostman.com/view/55072385/2sBY4LS2ZR#9125bbf2-31d2-4f4c-9fc3-9cd9f630d223)

A ready-to-import Postman collection is also included in this repo: [`GearUp_API.postman_collection.json`](./GearUp_API.postman_collection.json).

---

## 🧑‍🤝‍🧑 Roles & Permissions

| Role | Description | Key Permissions |
|------|--------------|------------------|
| **Customer** | Rents gear | Browse gear, place/cancel rental orders, pay via Stripe, leave reviews |
| **Provider** | Lists and rents out gear | Manage own gear inventory (create/update/soft-delete), view incoming orders, update order status |
| **Admin** | Platform moderator | View/suspend users, manage categories, view all gear & rental orders |

Users choose `CUSTOMER` or `PROVIDER` at registration. `ADMIN` accounts are seeded, not self-registered.

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| Node.js + Express 5 | REST API framework |
| TypeScript | Type safety |
| PostgreSQL + Prisma ORM | Database + data access |
| JWT (access + refresh tokens) | Authentication |
| Stripe Checkout | Payment processing |
| Zod | Request validation |
| bcryptjs | Password hashing |

---

## 📂 Project Structure

```
src/
├── app.ts                 # Express app setup (CORS, webhook route, JSON parsing, routers)
├── server.ts               # DB connection + server bootstrap
├── config/                 # Environment config
├── errors/                 # AppError class
├── lib/                    # Prisma client, Stripe client
├── middlewares/             # auth, validateRequest, notFound, globalErrorHandler
├── modules/
│   ├── auth/                # register, login, refresh-token, me
│   ├── category/             # gear categories (public read, admin write)
│   ├── gear/                 # public gear browsing/search
│   ├── rental/                # rental order lifecycle
│   ├── payment/               # Stripe checkout session, confirm, webhook
│   ├── provider/               # provider gear CRUD + order status updates
│   ├── review/                 # post-return reviews
│   └── admin/                   # user/gear/rental oversight
├── routes/                  # module router aggregation
├── types/                    # Express request augmentation (req.user)
└── utils/                    # catchAsync, jwt helpers, sendResponse

prisma/
├── schema/                   # modular Prisma schema (User, Category, GearItem, RentalOrder, Payment, Review)
└── migrations/                 # SQL migration history
```

Each domain module follows a consistent pattern: `*.routes.ts` → `*.controller.ts` → `*.service.ts`, with `*.validation.ts` (Zod) and `*.interface.ts` (types) alongside.

---

## 🗄️ Database Schema

| Model | Description |
|-------|--------------|
| **User** | Account info, `role` (`CUSTOMER` \| `PROVIDER` \| `ADMIN`), `status` (`ACTIVE` \| `SUSPENDED`) |
| **Category** | Gear categories (unique name) |
| **GearItem** | Rental listings — title, brand, price/day, quantity, availability, images; belongs to a `Provider` and `Category` |
| **RentalOrder** | A customer's booking of a gear item — dates, quantity, total price, status |
| **Payment** | One-to-one with a `RentalOrder` — Stripe transaction id, amount, method, status, `paidAt` |
| **Review** | One-to-one with a `RentalOrder` — rating (1–5) + comment, tied to the gear item |

### Rental Order Status Flow

```
PLACED ──(provider confirms)──► CONFIRMED ──(payment completes)──► PAID
  │                                                                   │
  └──(customer cancels, only while PLACED)──► CANCELLED       (provider marks)
                                                                       ▼
                                                                 PICKED_UP
                                                                       │
                                                          (provider marks)
                                                                       ▼
                                                                  RETURNED
```

Payment can only be created once an order is `CONFIRMED`; a successful Stripe payment moves the order to `PAID`.

---

## 🔐 Authentication

- JWT **access tokens** are returned in the response body and sent as `Authorization: Bearer <token>`.
- JWT **refresh tokens** are set as an `httpOnly` cookie and exchanged via `POST /api/auth/refresh-token`.
- Suspended users (`status: SUSPENDED`) are blocked from logging in or refreshing their token.

---

## 💳 Payments (Stripe)

- `POST /api/payments/create` — creates a Stripe Checkout Session for a `CONFIRMED` rental order and returns a `checkoutUrl`.
- `POST /api/payments/confirm` — verifies a completed session directly against Stripe by `sessionId` (useful for client-side confirmation flows).
- `POST /api/payments/webhook` — Stripe webhook listener; on `checkout.session.completed`, marks the payment `COMPLETED` and the rental order `PAID`.
- `GET /api/payments/success` / `GET /api/payments/cancel` — Stripe redirect targets after checkout.
- `GET /api/payments` / `GET /api/payments/:id` — payment history, scoped by role (customer sees own, provider sees payments for their gear, admin sees all).

---

## 📋 API Endpoints Overview

### Auth
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |
| GET | `/api/auth/me` | Authenticated |

### Categories
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/api/categories` | Public |
| POST | `/api/categories` | Admin |
| PUT | `/api/categories/:id` | Admin |
| DELETE | `/api/categories/:id` | Admin |

### Gear (Public)
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/api/gear` | Public — filter by category, brand, price range, search, pagination, sorting |
| GET | `/api/gear/:id` | Public |

### Rental Orders
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/api/rentals` | Customer |
| GET | `/api/rentals` | Authenticated — scoped by role |
| GET | `/api/rentals/:id` | Authenticated — owner, provider, or admin |
| PATCH | `/api/rentals/:id/cancel` | Customer — only while `PLACED` |

### Payments
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/api/payments/create` | Customer |
| POST | `/api/payments/confirm` | Authenticated |
| GET | `/api/payments` | Authenticated — scoped by role |
| GET | `/api/payments/:id` | Authenticated — owner, provider, or admin |

### Provider
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/api/provider/gear` | Provider |
| PUT | `/api/provider/gear/:id` | Provider (own gear) |
| DELETE | `/api/provider/gear/:id` | Provider (own gear) — soft delete, sets `isAvailable: false` |
| GET | `/api/provider/orders` | Provider |
| PATCH | `/api/provider/orders/:id` | Provider (own gear's orders) — `CONFIRMED`, `PICKED_UP`, `RETURNED` |

### Reviews
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/api/reviews` | Customer — only after order is `RETURNED` |

### Admin
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/api/admin/users` | Admin |
| PATCH | `/api/admin/users/:id` | Admin — suspend/activate |
| GET | `/api/admin/gear` | Admin |
| GET | `/api/admin/rentals` | Admin |

---

## ⚙️ Error Handling & Validation

- All errors return a consistent shape: `{ success: false, message, errorDetails }`.
- Request bodies/params/queries are validated with **Zod** via a shared `validateRequest` middleware before hitting the controller.
- Async route handlers are wrapped in `catchAsync` so thrown errors are forwarded to the global error handler automatically.
- Unmatched routes return a structured `404` via the `notFound` middleware.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (LTS)
- PostgreSQL database
- Stripe account (test mode is fine)

### 1. Clone & install
```bash
git clone https://github.com/shantoopaul/gearup.git
cd gearup
npm install
```

### 2. Configure environment
Copy `.env.example` to `.env` and fill in the values:

```env
NODE_ENV=development
PORT=5000
APP_URL=http://localhost:5000

BCRYPT_SALT_ROUNDS=10

DATABASE_URL="your-postgres-connection-string"

JWT_ACCESS_SECRET="your-access-secret"
JWT_ACCESS_EXPIRES_IN=15m

JWT_REFRESH_SECRET="your-refresh-secret"
JWT_REFRESH_EXPIRES_IN=30d

STRIPE_PRODUCT_ID="your-stripe-product-id"
STRIPE_SECRET_KEY="your-stripe-secret-key"
STRIPE_WEBHOOK_SECRET="your-stripe-webhook-secret"
```

### 3. Run migrations & generate the Prisma client
```bash
npx prisma migrate deploy
npx prisma generate
```

### 4. Start the server
```bash
npm run dev      # development, with watch mode
npm run build    # bundle for production (tsup)
npm start        # run the built output
```

The API will be available at `http://localhost:5000/api`.

---

## 🔑 Admin Access

Admin accounts aren't created through `POST /api/auth/register` (that endpoint only accepts `CUSTOMER` or `PROVIDER`). Provision an admin directly in the database (e.g. via a seed script or a manual insert with a bcrypt-hashed password and `role: ADMIN`), then log in normally through `POST /api/auth/login`.

```
Admin Email    : admin@gearup.com
Admin Password : Admin123
```

---

## 📦 Deployment

This project is configured for **Vercel** (`vercel.json`) using the `tsup`-bundled output at `dist/server.js`. Any Node-friendly host (Render, Railway, etc.) works as well — just run `npm run build` followed by `npm start`.