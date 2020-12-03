module.exports = {
  plugins: [
    require('postcss-import'),
    require('postcss-nested'),
    require('tailwindcss')('./styles/tailwind.config.js'),
    require('autoprefixer'),
  ],
};
