/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'tech-black': '#000000',
        'tech-gray': '#1a1a1a',
        'tech-dark': '#0a0a0a',
        'tech-card': '#1a1a1a',
        'tech-modal': '#111111',
        'tech-input': '#1e1e1e',
        'tech-cyan': '#00e5ff',
        'tech-purple': '#bb86fc',
        'tech-green': '#00ff88',
        'tech-orange': '#ffab00',
        'tech-red': '#ff073a',
        'tech-gold': '#ffd700',
        'text-primary': '#ffffff',
        'text-secondary': '#e0e0e0',
        'text-muted': '#a0a0a0',
      },
      backgroundImage: {
        'tech-gradient': 'linear-gradient(135deg, #000000 0%, #0a0a0a 100%)',
        'glass-gradient': 'linear-gradient(rgba(255,255,255,0.05), rgba(255,255,255,0.02))',
      },
      boxShadow: {
        'tech-glow': '0 0 20px rgba(0, 229, 255, 0.3)',
        'tech-glow-hover': '0 0 30px rgba(0, 229, 255, 0.5)',
        'glass': '0 8px 32px rgba(0, 0, 0, 0.3)',
      },
      backdropBlur: {
        'xs': '2px',
      }
    },
  },
  plugins: [],
};
