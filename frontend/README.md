# 🎨 As You Like - Frontend

This is the frontend portion of the **As You Like** Bespoke Tailoring Shop application. Built with React.js and Vite.

## 🚀 Features
- **Dynamic Product Catalog**: Filter and browse suits, shirts, and fabrics.
- **Interactive UI**: Powered by Framer Motion for smooth transitions.
- **Responsive Design**: Fully optimized for mobile and desktop.
- **State Management**: Context API / Hooks for cart and user state.

## 🛠️ Getting Started

### 1. Installation
```bash
npm install
```

### 2. Run in Development
```bash
npm run dev
```

### 3. Build for Production
```bash
npm run build
```

## 🔌 API Connection
The frontend communicates with the backend via a proxy or base URL configured in `src/services/api.js`. In production (Vercel), API requests are rewritten as per `vercel.json` in the root directory.

## 📁 Folder Structure
- `src/components`: Reusable UI components.
- `src/pages`: Main view components.
- `src/services`: API call logic.
- `src/store`: State management logic.
- `src/assets`: Images and icons.
