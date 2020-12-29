const defaultTheme = require('tailwindcss/defaultTheme')
const colors = require('tailwindcss/colors');

module.exports = {
  darkMode: 'media',
  purge: {
    content: ["_site/**/*.html"],
    options: {
      whitelist: [],
    },
  },
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
          DEFAULT: '#080808',
        },
        gray: colors.warmGray,
      },
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
      },
      spacing: {
        '2px': '2px',
        '16/9': '56.25%',
      },
      maxHeight: theme => ({
        'screen-28': `calc(100vh - ${theme('spacing.28')})`,
      }),
      screens: {
        'print': {'raw': 'print'},
      },
      typography: theme => ({
        DEFAULT: {
          css: {
            color: theme('colors.gray.700'),
            '[class~="lead"]': {
              color: theme('colors.gray.700'),
            },
            a: {
              color: theme('colors.gray.900'),
            },
            strong: {
              color: theme('colors.gray.900'),
            },
            'ol > li::before': {
              color: theme('colors.gray.600'),
            },
            'ul > li::before': {
              backgroundColor: theme('colors.gray.400'),
            },
            hr: {
              color: theme('colors.gray.300'),
            },
            blockquote: {
              color: theme('colors.gray.900'),
              borderLeftColor: theme('colors.gray.300'),
            },
            h1: {
              color: theme('colors.gray.900'),
            },
            h2: {
              color: theme('colors.gray.900'),
            },
            h3: {
              color: theme('colors.gray.900'),
            },
            h4: {
              color: theme('colors.gray.900'),
            },
            'figure figcaption': {
              color: theme('colors.gray.600'),
            },
            thead: {
              color: theme('colors.gray.900'),
              borderBottomColor: theme('colors.gray.400'),
            },
            'tbody tr': {
              borderBottomColor: theme('colors.gray.300'),
            },
            code: {
              color: theme('colors.black'),
            },
            pre: null,
            'pre code': null,
            'pre code::after': {
              content: "",
              display: 'none'
            },
            img: {
              'margin-top': '0.5rem',
              'margin-bottom': '0.5rem',
              'margin-right': '0.5rem',
              display: 'inline'
            }
          }
        },
        dark: {
          css: {
            color: theme('colors.gray.300'),
            '[class~="lead"]': {
              color: theme('colors.gray.300'),
            },
            a: {
              color: theme('colors.gray.100'),
            },
            strong: {
              color: theme('colors.gray.100'),
            },
            'ol > li::before': {
              color: theme('colors.gray.400'),
            },
            'ul > li::before': {
              backgroundColor: theme('colors.gray.600'),
            },
            hr: {
              borderColor: theme('colors.gray.700'),
            },
            blockquote: {
              color: theme('colors.gray.100'),
              borderLeftColor: theme('colors.gray.700'),
            },
            h1: {
              color: theme('colors.gray.100'),
            },
            h2: {
              color: theme('colors.gray.100'),
            },
            h3: {
              color: theme('colors.gray.100'),
            },
            h4: {
              color: theme('colors.gray.100'),
            },
            'figure figcaption': {
              color: theme('colors.gray.600'),
            },
            thead: {
              color: theme('colors.gray.100'),
              borderBottomColor: theme('colors.gray.400'),
            },
            'tbody tr': {
              borderBottomColor: theme('colors.gray.700'),
            },
            code: {
              color: theme('colors.white'),
            },
          }
        },
      }),
    }
  },
  variants: {
    extend: {
      textColor: ['group-focus'],
      typography: ['dark']
    }
  },
  plugins: [
    require('@tailwindcss/typography')
  ],
};
