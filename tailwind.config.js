/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Palette-driven via CSS custom properties defined in index.css and
        // overridden at runtime by PaletteInjector. Using rgb(<vars> / <alpha>)
        // so opacity modifiers like bg-marine/25 still work.
        marine: {
          DEFAULT: 'rgb(var(--c-marine) / <alpha-value>)',
          dark: 'rgb(var(--c-marine-dark) / <alpha-value>)',
          light: 'rgb(var(--c-marine-light) / <alpha-value>)',
        },
        orange: {
          DEFAULT: 'rgb(var(--c-orange) / <alpha-value>)',
          light: 'rgb(var(--c-orange-light) / <alpha-value>)',
          dark: 'rgb(var(--c-orange-dark) / <alpha-value>)',
        },
        sand: 'rgb(var(--c-sand) / <alpha-value>)',
        ink: 'rgb(var(--c-ink) / <alpha-value>)',
      },
      fontFamily: {
        // Ronzino is the site's primary typeface for both headings and
        // body copy. Instrument Serif / Geist are kept as fallbacks so
        // the site still reads clearly if the Ronzino woff2 files aren't
        // present in /public/fonts/.
        display: ['Ronzino', '"Instrument Serif"', 'serif'],
        body: ['Ronzino', '"Geist"', 'sans-serif'],
      },
      letterSpacing: {
        widest2: '0.28em',
      },
    },
  },
  plugins: [],
}
