/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './**/*.html',
    '!./node_modules/**',
    '!./VAHorizonWebsiteStyle/**',
    '!./lighthouse-report.html',
  ],
  theme: {
    extend: {
      colors: {
        'va-navy': '#082541',
        'va-navy-dark': '#061d33',
        'va-gold': '#C5A059',
        'va-smoke': '#F8F9FA',
        'va-dark': '#1A1A1A',
        'va-divider': '#E2E8F0',
        // ai-automations.html specific
        'neon-blue': '#0066ff',
        'glass-border': 'rgba(255,255,255,0.08)',
        'glass-bg': 'rgba(10,25,45,0.6)',
      },
      fontFamily: {
        montserrat: ['Montserrat', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [],
};
