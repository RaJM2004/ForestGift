# ForestGift - Sustainable Gifting & Forest Monitoring Dashboard

ForestGift is a comprehensive multi-role dashboard system designed to manage large-scale reforestation efforts and sustainable gifting. The platform connects Citizens, NGOs, and Cake Vendors under a unified administrative umbrella to ensure transparent tree plantation and celebration.

## 🚀 Project Overview

The platform supports four distinct user roles:
1. **Admin**: Manages the entire ecosystem, monitors NGOs, assigns plantation tasks, and handles global finances.
2. **Citizen (User)**: Tracks their tree plantation progress, views certificates, and manages their contributions.
3. **NGO**: Receives plantation assignments, updates live progress, and submits growth reports.
4. **Cake Vendor**: Manages celebratory gifting allocations for birthdays and events associated with the plantation project.

## 🛠️ Technology Stack

- **Frontend**: React (Vite), Tailwind CSS, Three.js (for immersive 3D background), Leaflet (for maps), Recharts (for analytics).
- **Backend**: Node.js, Express, TypeScript.
- **Database**: MongoDB (Mongoose).

---

## 💻 Installation & Setup

### 1. Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas)
- npm or yarn

### 2. Clone the Repository
```bash
git clone https://github.com/RaJM2004/ForestGift.git
cd ForestGift
```

### 3. Backend Setup
1. Navigate to the server directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `server` directory and add the following:
   ```env
   PORT=5000
MONGODB_URI=mongodb+srv://rajmangezerokost_db_user:G3qiTG5iVGwtkNLS@cluster0.uxlc4cn.mongodb.net/forest_dashboard?retryWrites=true&w=majority&appName=Cluster0
RAZORPAY_KEY_ID=rzp_test_Sokf2g61PuLoiU
RAZORPAY_KEY_SECRET=9cS69f2j4khZddvefRWkbbD1
RESEND_API_KEY=re_AkRw4SEj_EH7sq8mF4jKTxueoNtDvCiAx
RESEND_FROM_EMAIL=support@forestgift.in
   ```
4. Start the server:
   ```bash
   npm run dev
   ```

### 4. Frontend Setup
1. Navigate to the client directory:
   ```bash
   cd ../client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```

---

## 🔑 Login & Access

The project uses email-only authentication for demonstration. You can use the following credentials to access the different dashboards:

| Role | Email | Dashboard Access |
| :--- | :--- | :--- |
| **Admin** | `admin@forestgift.com` | Full Control Panel |
| **User** | `ramesh@email.com` | My Plantation Portal |
| **NGO** | `greenearth@ngo.in` | NGO Management Console |
| **Vendor** | `indore@cakes.com` | Bakery Allocation Panel |

### 📂 Initializing Data
After starting both servers, you should seed the database to see the sample data. 
Open your browser or a tool like Postman and make a **POST** request to:
`http://localhost:5000/api/seed`

---

## 📂 Project Structure

- `/client`: React frontend application.
- `/server`: Express backend with Mongoose models and controllers.
- `/features`: Modular components for each dashboard.
- `/shared`: Reusable layouts and UI components.

## 🌲 3D Background
The login page features a cinematic 3D forest experience. If you experience performance issues, ensure your browser has hardware acceleration enabled.

---

**Developed for ForestGift - Sustainable Gifting Solutions.**
