module.exports = {
  plugins: [
    require('postcss-import'),
    require('postcss-nested'),
    require('@tailwindcss/jit')('./styles/tailwind.config.js'),
    require('autoprefixer'),
  ],
};
