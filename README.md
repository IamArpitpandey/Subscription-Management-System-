# Brightloop — Subscription Management System

A modern subscription management platform designed to simplify customer management, subscription lifecycles, invoicing, payments, and business reporting.

Brightloop aims to provide businesses with a centralized platform to manage their subscription operations through a clean, intuitive, and responsive interface.

---

## 🚀 Overview

**Brightloop** is a full-stack subscription management application built to streamline recurring business operations.

The platform is designed around the complete subscription lifecycle — from customer onboarding and product configuration to subscription management, invoicing, payment tracking, and reporting.

## ✨ Key Features

### 👥 User Management & Authentication
- User registration and login.
- Role-based access control.
- Admin, Staff, and Customer roles.
- Protected application routes.
- Password-based authentication.

### 📦 Product Management
- Manage products and product information.
- Configure product pricing.
- Support product variants and additional pricing.
- Maintain product details and descriptions.

### 📅 Subscription & Plan Management
- Configure subscription plans.
- Support daily, weekly, monthly, and yearly billing frequencies.
- Manage subscription lifecycle.
- Pause and resume subscriptions.
- Renew and cancel subscriptions.
- Track subscription status and history.

### 📝 Quotations
- Create and manage quotations.
- Support reusable quotation templates.
- Convert quotations into subscriptions.

### 🧾 Invoicing & Billing
- Manage customer invoices.
- Track invoice status.
- Support recurring billing workflows.
- Configure taxes and billing amounts.

### 💳 Payment Management
- Record payments against invoices.
- Track partial and outstanding payments.
- Maintain payment history.
- Monitor payment status.

### 🎯 Discount Management
- Configure fixed and percentage-based discounts.
- Define discount eligibility conditions.
- Manage discount validity and usage limits.

### 📊 Dashboard & Reports
- View subscription-related business metrics.
- Monitor revenue and payment information.
- Track active subscriptions.
- Review outstanding invoices.

### 🌐 Customer Portal
- Customer-focused account experience.
- Access subscription information.
- View invoices and payment history.

*Note: Feature availability and completeness should be verified against the current implementation.*

---

## 🛠️ Technology Stack

| Technology | Purpose |
|---|---|
| Next.js | Full-stack React framework |
| React | User interface |
| TypeScript | Type-safe development |
| Tailwind CSS | Styling |
| Prisma ORM | Database access |
| SQLite | Development database |
| Lucide React | Icons |
| Node.js | Runtime environment |
| npm | Package management |

---

## 📁 Project Structure

```text
brightloop/
│
├── prisma/
│   └── migrations/
│
├── public/
│
├── scripts/
│
├── src/
│   ├── app/
│   ├── components/
│   └── ...
│
├── .gitignore
├── package.json
├── package-lock.json
├── postcss.config.mjs
├── next.config.ts
├── tsconfig.json
└── README.md
```

---

## ⚙️ Getting Started

Follow these instructions to run Brightloop locally.

### Prerequisites

Make sure you have installed:

- Node.js
- npm
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/IamArpitpandey/Subscription-Management-System-.git
```

### 2. Navigate to the Project

```bash
cd Subscription-Management-System-
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env` file in the project root.

Refer to `.env.example` or the environment variable requirements in the project configuration.

**Important:** Never commit your `.env` file or expose API keys, passwords, or application secrets.

### 5. Generate Prisma Client

```bash
npx prisma generate
```

### 6. Run Database Migrations

```bash
npx prisma migrate dev
```

### 7. Start the Development Server

```bash
npm run dev -- --webpack
```

Open your browser:

```text
http://localhost:3000
```

---

## 🔐 User Roles

| Role | Access |
|---|---|
| Admin | Administrative operations |
| Staff | Operational management |
| Customer | Customer-specific subscriptions and invoices |

---

## 🔄 Subscription Lifecycle

The platform is designed around the following subscription workflow:

```text
Draft
  ↓
Quotation
  ↓
Confirmed
  ↓
Active
  ↓
Closed
```

Subscriptions can also support operations such as pausing, resuming, renewing, and cancellation.

---

## 🗄️ Database

Brightloop uses Prisma ORM for database access and schema management.

Database migrations are maintained in:

```text
prisma/migrations/
```

To generate Prisma Client:

```bash
npx prisma generate
```

To apply development migrations:

```bash
npx prisma migrate dev
```

---

## 📸 Screenshots

Screenshots of the application will be added here.

| Dashboard | Authentication |
|---|---|
| Coming Soon | Coming Soon |

---

## 🗺️ Future Improvements

Potential improvements include:

- Production deployment and infrastructure.
- Integration with payment gateways.
- Automated recurring invoice scheduling.
- Advanced analytics and reporting.
- Improved notification workflows.
- Comprehensive automated testing.

---

## 🤝 Contributing

Contributions, suggestions, and feedback are welcome.

1. Fork the repository.
2. Create a feature branch.
3. Make your changes.
4. Commit your changes.
5. Submit a Pull Request.

---

## 👨‍💻 Author

**Arpit Pandey**

Software Engineer | Full-Stack Developer

- GitHub: [@IamArpitpandey](https://github.com/IamArpitpandey)

---

## 📄 License

No license has currently been specified for this repository.

---

<p align="center">
  <strong>Brightloop — Simplifying Subscription Management.</strong>
</p>