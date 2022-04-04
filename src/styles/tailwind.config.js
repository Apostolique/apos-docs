const defaultTheme = require('tailwindcss/defaultTheme')
const colors = require('tailwindcss/colors');

let config = {
  mode: 'jit',
  darkMode: 'media',
  content: [
    "./_site/**/*.html",
    // { raw: rawFile, extension: 'html' },
  ],
  theme: {
    extend: {
      colors: {
        code: {
          blue: '#3498db',
          gray: '#5c6370',
          dark: '#263040',
          green: '#2ecc71',
          indigo: '#6c71c4',
          light: '#d2d6db',
          orange: '#e67e22',
          red: '#e74c3c',
          yellow: '#f1c40f',
          white: '#efefef',
          header: '#111111',
          DEFAULT: '#080808',
        },
      },
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
      },
      spacing: {
        '2px': '2px',
        '16/9': '56.25%',
      },
      minWidth: {
        '65ch': '65ch',
      },
    }
  },
  variants: {},
  plugins: [
    require('@tailwindcss/typography')
  ],
};

config.dynamicContent = content => ({ ...config, content })

module.exports = config;
