// CRA wired Tailwind's PostCSS internally; Vite needs it declared explicitly.
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
