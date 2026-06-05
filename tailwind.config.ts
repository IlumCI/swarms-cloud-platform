import type { Config } from 'tailwindcss';

/**
 * Helper: emit `rgb(var(--token) / <alpha-value>)` so Tailwind opacity modifiers
 * (e.g. `bg-card/50`) work against CSS variables that hold raw "R G B" triplets.
 */
const token = (name: string) => `rgb(var(--${name}) / <alpha-value>)`;

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '1rem',
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1400px',
      },
    },
    extend: {
      minHeight: {
        screen: '100vh',
        'screen-dvh': '100dvh',
      },
      maxWidth: {
        '8xl': '90rem',
        '9xl': '100rem',
      },
      colors: {
        /* Semantic Vercel-inspired palette */
        background: token('background'),
        foreground: token('foreground'),
        card: {
          DEFAULT: token('card'),
          foreground: token('card-foreground'),
        },
        subtle: {
          DEFAULT: token('subtle'),
          foreground: token('subtle-foreground'),
        },
        muted: {
          DEFAULT: token('muted'),
          foreground: token('muted-foreground'),
        },
        border: {
          DEFAULT: token('border'),
          strong: token('border-strong'),
        },
        input: token('input'),
        ring: token('ring'),
        accent: {
          DEFAULT: token('accent'),
          foreground: token('accent-foreground'),
          muted: token('accent-muted'),
        },
        success: {
          DEFAULT: token('success'),
          foreground: token('success-foreground'),
        },
        warning: {
          DEFAULT: token('warning'),
          foreground: token('warning-foreground'),
        },
        danger: {
          DEFAULT: token('danger'),
          foreground: token('danger-foreground'),
        },

      },
      fontFamily: {
        sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'SFMono-Regular', 'monospace'],
        display: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '6px',
        sm: '4px',
        md: '6px',
        lg: '8px',
        xl: '12px',
      },
      boxShadow: {
        xs: '0 1px 2px 0 rgb(0 0 0 / 0.04)',
        sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.06), 0 1px 2px -1px rgb(0 0 0 / 0.06)',
        md: '0 4px 6px -1px rgb(0 0 0 / 0.07), 0 2px 4px -2px rgb(0 0 0 / 0.06)',
        lg: '0 10px 15px -3px rgb(0 0 0 / 0.08), 0 4px 6px -4px rgb(0 0 0 / 0.06)',
        focus: '0 0 0 2px rgb(var(--background)), 0 0 0 4px rgb(var(--ring) / 0.5)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 200ms ease-out',
        'slide-up': 'slideUp 240ms cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(6px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
