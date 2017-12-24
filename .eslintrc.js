module.exports = {
  env: {
    browser: true,
    es6: true
  },
  parser: "babel-eslint",
  extends: "eslint:recommended",
  plugins: [],
  rules: {
    indent: ["warn", 2, { SwitchCase: 1 }],
    "no-sparse-arrays": "off",
    "no-console": "off",
    "no-unused-vars": "warn",
    "space-before-function-paren": [ "warn", "never" ]
  },
  globals: {
    AudioContext: false,
    webkitAudioContext: false,
    mozAudioContext: false
  }
};
