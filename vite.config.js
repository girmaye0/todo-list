import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./test.setup.js",
  },
  server: {
    hmr: {
      overlay: false,
    },
  },
});

// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   test: {
//     environment: "jsdom",
//     globals: true,
//     setupFiles: "./test.setup.js",
//   },
// });
// export default defineConfig({
//   server: {
//     hmr: {
//       overlay: false,
//     },
//   },
// });
