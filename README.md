# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

0349181240
## Getting Started

Quick steps to run this project locally:

- Install dependencies:

	npm install

- Create a local env file from the example and update values if needed:

	cp .env.example .env

- Start development server with HMR:

	npm run dev

- Build for production:

	npm run build

- Lint the codebase:

	npm run lint

Notes:

- Keep `.env` out of source control. A `.env.example` is provided with the default `VITE_API_URL`.
- If you use a different branch name than `main`, replace it when pushing to your remote.