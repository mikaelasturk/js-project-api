// ESLint config for backend (ES2022, Node.js)
export default {
  linterOptions: {
    reportUnusedDisableDirectives: true,
  },
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: "module",
    globals: {
      process: "readonly",
      __dirname: "readonly",
      require: "readonly",
      module: "readonly",
      exports: "readonly",
      global: "readonly",
      Buffer: "readonly",
      setImmediate: "readonly",
      clearImmediate: "readonly",
      setInterval: "readonly",
      clearInterval: "readonly",
      setTimeout: "readonly",
      clearTimeout: "readonly",
    },
  },
  // plugins: {},
  rules: {
    "no-unused-vars": "warn",
    "no-console": "off",
  },
  ignores: ["node_modules/", "dist/"],
};
