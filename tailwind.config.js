const defaultTheme = require('tailwindcss/defaultTheme');
module.exports = {
    content: ['./src/**/*.{html,js,vue}',],
    theme: {  
       
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