import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '1rem',
			screens: {
				sm: '640px',
				md: '768px',
				lg: '1024px',
				xl: '1280px',
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				heading: ['var(--font-heading)', 'sans-serif'],
				body: ['var(--font-body)', 'sans-serif'],
				mono: ['var(--font-mono)', 'monospace'],
			},
			fontSize: {
				'display-2xl': ['4.5rem', { lineHeight: '1', letterSpacing: '-0.02em', fontWeight: '700' }],
				'display-xl': ['3.75rem', { lineHeight: '1', letterSpacing: '-0.02em', fontWeight: '700' }],
				'display-lg': ['3rem', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '700' }],
				'display-md': ['2.25rem', { lineHeight: '1.2', letterSpacing: '-0.01em', fontWeight: '700' }],
				'display-sm': ['1.875rem', { lineHeight: '1.3', letterSpacing: '-0.01em', fontWeight: '600' }],
				'display-xs': ['1.5rem', { lineHeight: '1.4', fontWeight: '600' }],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// GRATIS Brand Colors
				'jet-black': '#0D0D0D',
				'hot-lime': '#C1FF00',
				'electric-blue': '#00AFFF',
				'hot-magenta': '#FF0077',
				'solar-orange': '#FF5F00',
				'soft-gray': '#F5F5F5',
				'medium-gray': '#888888',
				'dark-gray': '#333333',
				// Semantic colors
				'success': '#00C853',
				'warning': '#FFB300',
				'error': '#FF1744',
				'info': '#00B0FF',
				// Surface variants
				'surface': {
					DEFAULT: '#FFFFFF',
					dark: '#1A1A1A',
				},
			},
			spacing: {
				'18': '4.5rem',
				'88': '22rem',
				'128': '32rem',
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
				'4xl': '2rem',
				'5xl': '2.5rem',
			},
			boxShadow: {
				'glow-lime': '0 0 40px rgba(193, 255, 0, 0.3)',
				'glow-blue': '0 0 40px rgba(0, 175, 255, 0.3)',
				'glow-magenta': '0 0 40px rgba(255, 0, 119, 0.3)',
				'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
				'card-hover': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
			},
			backgroundImage: {
				'gradient-gratis': 'linear-gradient(135deg, #C1FF00 0%, #00AFFF 50%, #FF0077 100%)',
				'gradient-dark': 'linear-gradient(180deg, #0D0D0D 0%, #1A1A1A 100%)',
				'gradient-radial': 'radial-gradient(ellipse at center, var(--tw-gradient-stops))',
			},
			transitionTimingFunction: {
				'bounce-in': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
				'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				// Added rich motion keyframes
				'fade-in': {
					'0%': { opacity: '0', transform: 'translateY(10px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'fade-out': {
					'0%': { opacity: '1', transform: 'translateY(0)' },
					'100%': { opacity: '0', transform: 'translateY(10px)' }
				},
				'scale-in': {
					'0%': { transform: 'scale(0.95)', opacity: '0' },
					'100%': { transform: 'scale(1)', opacity: '1' }
				},
				'scale-out': {
					from: { transform: 'scale(1)', opacity: '1' },
					to: { transform: 'scale(0.95)', opacity: '0' }
				},
				'slide-in-right': {
					'0%': { transform: 'translateX(100%)' },
					'100%': { transform: 'translateX(0)' }
				},
				'slide-out-right': {
					'0%': { transform: 'translateX(0)' },
					'100%': { transform: 'translateX(100%)' }
				},
				'gradient-x': {
					'0%, 100%': { 'background-position': '0% 50%' },
					'50%': { 'background-position': '100% 50%' },
				},
				'gradient-y': {
					'0%, 100%': { 'background-position': '50% 0%' },
					'50%': { 'background-position': '50% 100%' },
				},
				'pulse-slow': {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0.5' },
				},
				'fade-in-up': {
					'0%': { opacity: '0', transform: 'translateY(20px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' },
				},
				'fade-in-down': {
					'0%': { opacity: '0', transform: 'translateY(-20px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' },
				},
				'slide-in-left': {
					'0%': { opacity: '0', transform: 'translateX(-20px)' },
					'100%': { opacity: '1', transform: 'translateX(0)' },
				},
				'gradient-xy': {
					'0%, 100%': { 'background-position': '0% 0%' },
					'25%': { 'background-position': '100% 0%' },
					'50%': { 'background-position': '100% 100%' },
					'75%': { 'background-position': '0% 100%' },
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				// Added rich motion animations
				'fade-in': 'fade-in 0.3s ease-out',
				'fade-out': 'fade-out 0.3s ease-out',
				'scale-in': 'scale-in 0.2s ease-out',
				'scale-out': 'scale-out 0.2s ease-out',
				'slide-in-right': 'slide-in-right 0.3s ease-out',
				'slide-out-right': 'slide-out-right 0.3s ease-out',
				'slide-in-left': 'slide-in-left 0.3s ease-out',
				'fade-in-up': 'fade-in-up 0.5s ease-out',
				'fade-in-down': 'fade-in-down 0.5s ease-out',
				'gradient-x': 'gradient-x 3s ease infinite',
				'gradient-y': 'gradient-y 3s ease infinite',
				'gradient-xy': 'gradient-xy 3s ease infinite',
				'pulse-slow': 'pulse-slow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
				'bounce-slow': 'bounce 2s infinite',
				'spin-slow': 'spin 3s linear infinite',
				enter: 'fade-in 0.3s ease-out, scale-in 0.2s ease-out',
				exit: 'fade-out 0.3s ease-out, scale-out 0.2s ease-out'
			}
		}
	},
	plugins: [
		require("tailwindcss-animate"),
		require("@tailwindcss/typography"),
	],
} satisfies Config;
