/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        console: {
          green: '#00ff00',
          'green-dark': '#00cc00',
          'green-light': '#33ff33',
          bg: '#0a0a0a',
          'bg-dark': '#000000',
        },
      },
      fontFamily: {
        console: ['Courier New', 'Courier', 'monospace'],
      },
      animation: {
        'scan-line': 'scan-line 8s linear infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'flicker': 'flicker 0.15s infinite',
      },
      keyframes: {
        'scan-line': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        'glow': {
          '0%': { textShadow: '0 0 5px #00ff00, 0 0 10px #00ff00, 0 0 15px #00ff00' },
          '100%': { textShadow: '0 0 10px #00ff00, 0 0 20px #00ff00, 0 0 30px #00ff00' },
        },
        'flicker': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
      },
    },
  },
  plugins: [
    function ({ addBase, addUtilities }) {
      addBase({
        body: {
          margin: '0',
          minHeight: '100vh',
          backgroundColor: '#0a0a0a',
          color: '#00ff00',
          fontFamily: 'Courier New, Courier, monospace',
        },
        '#root': {
          minHeight: '100vh',
          backgroundColor: '#0a0a0a',
        },
      });
      addUtilities({
        '.console-text': {
          color: '#00ff00',
          textShadow: '0 0 5px #00ff00',
        },
        '.console-border': {
          borderColor: '#00ff00',
          boxShadow: '0 0 10px rgba(0, 255, 0, 0.3)',
        },
        '.console-glow': {
          textShadow: '0 0 5px #00ff00, 0 0 10px #00ff00',
        },
      });
    },
  ],
};
