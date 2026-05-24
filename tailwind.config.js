/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{ts,tsx}",
    "./node_modules/@gluestack-ui/nativewind-utils/**/*.js",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [require("@gluestack-ui/nativewind-utils/tailwind-plugin")],
};
