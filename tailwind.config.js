const defaultTheme = require('tailwindcss/defaultTheme');
module.exports = {
    content: ['./src/**/*.{html,js,vue}',],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Poppins', ...defaultTheme.fontFamily.sans],
            },
        },
    },
    variants: {
      
    },
    plugins: [
            require('daisyui') 
    ],
    daisyui: {
        themes: ["light"],
    },
}