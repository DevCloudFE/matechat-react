module.exports = {
  content: [
    './docs/**/*.{md,mdx,js,ts,jsx,tsx}',
    './theme/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: ['selector'],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: 'hsl(var(--primary))',
      }
    }
  }
}
