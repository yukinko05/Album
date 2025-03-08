/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			colors: {
				// background: "rgb(var(--background))",
				foreground: "rgb(var(--foreground))",
				btn: {
					background: "rgb(var(--btn-background))",
					"background-hover": "rgb(var(--btn-background-hover))",
				},
			},
			fontFamily: {
				cherry: ['"Cherry Bomb One"', "cursive"],
			},
		},
	},
	darkMode: "class",
	plugins: [],
};
