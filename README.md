# <!-- Hammer Grammar icon --> ISE-English-Centre-Management <!-- omit in toc -->

---

## 📁 Table of Contents <!-- omit in toc -->

- [🧍 Introduction](#-introduction)
- [⚙️ Tech Stack](#️-tech-stack)
- [📋 Features](#-features)
- [🚀 Quick Start](#-quick-start)

---

## 🧍 Introduction

Hammer & Grammar is a web-based management system for tutoring centers that unifies academic, administrative, and communication workflows. It addresses common operational pain points such as manual contract handling, fragmented academic tracking, staff coordination, class data access, and resource management in one coherent platform.

The system is built to be beginner-friendly with a simple UI and role-based access, while its three-tier client–server architecture (ReactJS frontend, Python backend, MySQL database) provides scalability, security, and maintainability.

---

## ⚙️ Tech Stack

- **Frontend**: React, TypeScript, Vite, ESLint
- **Backend**: Python (see `backend/`)
- **Tooling**: Git, npm

---

## 📋 Features

- **Digital Contract Management**: Create, track, and update student contracts (tuition, timelines) to reduce errors and improve oversight.
- **Academic Progress Tracking**: Monitor attendance, homework, tests, grades, comments, and behavioral reports; auto-feeds report card generation for parents.
- **Staff & Teacher Coordination**: Track attendance, leaves, and substitutes; streamline workload management and communication across roles.
- **Class & Resource Information**: Keep class lists, enrollments, schedules, and resources current for data-driven operations and replenishment.
- **Beginner-Friendly Interface**: Simple, intuitive UI with role-based access control for confidentiality.
- **Scalable & Secure Architecture**: Three-tier client–server model using ReactJS, Python, and MySQL.

---

## 🚀 Quick Start
Follow these steps to set up the project locally on your machine.

**Prerequisites**

Make sure you have the following installed on your machine:

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/en)
- [npm](https://www.npmjs.com/) (Node Package Manager)

**Cloning the Repository**

```bash
git clone https://github.com/e-yee/ISE-English-Centre-Management.git
cd ISE-English-Centre-Management
```

### Frontend (Vite + React)

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

### Backend (Python)

[Unverified] Minimal steps — adjust to your local setup if different.

```bash
cd backend
python -m venv .venv
./.venv/Scripts/activate  # Windows PowerShell: .venv\Scripts\Activate.ps1
pip install -r requirements.txt  # if present
cd src
python application.py
```

---