/** @type {import('tailwindcss').Config} */
module.exports = {
    // NOTE: Update this to include the paths to all files that contain Nativewind classes.
    content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
    presets: [require("nativewind/preset")],
    theme: {
        extend: {
            fontFamily: {
                dmsans: [ 'DMSans-Regular', 'sans-serif' ],
                "dmsans-bold": [ 'DMSans-Bold', 'sans-serif' ],
                "dmsans-black": [ 'DMSans-Black', 'sans-serif' ],
                "dmsans-extrabold": [ 'DMSans-ExtraBold', 'sans-serif' ],
                "dmsans-extralight": [ 'DMSans-ExtraLight', 'sans-serif' ],
                "dmsans-light": [ 'DMSans-Light', 'sans-serif' ],
                "dmsans-medium": [ 'DMSans-Medium', 'sans-serif' ],
                "dmsans-semibold": [ 'DMSans-Semibold', 'sans-serif' ],
                "dmsans-thin": [ 'DMSans-Thin', 'sans-serif' ]
            }
        }
    },
    plugins: [],
}