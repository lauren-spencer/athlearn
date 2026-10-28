/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        app: '#0D1117',
        backdrop: '#07090D',
        panel: '#151B24',
        'panel-2': '#1B2330',
        line: '#252E3C',
        'line-2': '#323D4F',
        ink: '#F2F4F8',
        muted: '#8D98AB',
        dim: '#5E697C',
        flag: '#FFC531',
        familiar: '#1F3F70',
        proficient: '#2F68C2',
        mastered: '#4C9BFF',
        good: '#2BD07F',
        bad: '#FF5A5F',
        chalk: '#0E2419',
      },
      fontFamily: {
        display: ['"Big Shoulders Display"', 'Impact', 'sans-serif'],
        label: ['"Barlow Condensed"', 'Arial Narrow', 'sans-serif'],
        body: ['Barlow', 'system-ui', 'sans-serif'],
      },
      letterSpacing: { label: '0.12em' },
      borderRadius: { btn: '10px' },
    },
  },
  plugins: [],
}
