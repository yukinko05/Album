const { nextui } = require("@nextui-org/react");

/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
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
		},
	},
	darkMode: "class",
	plugins: [nextui()],
};
