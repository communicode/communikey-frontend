/*
[References]
ESLint
  http://eslint.org/docs/rules
  http://eslint.org/docs/user-guide/configuring
  http://eslint.org/docs/user-guide/configuring#using-configuration-files
  http://eslint.org/docs/user-guide/configuring#specifying-environments
  http://eslint.org/docs/user-guide/configuring.html#specifying-globals
  https://github.com/yannickcr/eslint-plugin-react
*/
module.exports = {
  "env": {
    "browser": true,
    "es6": true,
    "jasmine": true,
    "jest": true,
    "node": true,
  },
  "parserOptions": {
    "sourceType": "module",
    "ecmaVersion": 6,
    "ecmaFeatures": {
      "jsx": true
    }
  },
  "plugins": [
    "jest",
    "react"
  ],
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended"
  ],
  "rules": {
    // Style Guide
    "array-bracket-spacing": ["error", "never"],
    "comma-dangle": ["error", "never"],
    "curly": ["error", "all"],
    "func-call-spacing": ["error", "never"],
    "indent": ["error", 2],
    "linebreak-style": ["error", "unix"],
    "no-duplicate-imports": "error",
    "no-floating-decimal": "error",
    "no-tabs": "error",
    "no-trailing-spaces": ["error", {
      "skipBlankLines": false
    }],
    "no-var": "error",
    "no-whitespace-before-property": "error",
    "quotes": ["error", "double"],
    "semi": ["error", "always"],
    // Error Prevention
    "no-cond-assign": ["error", "always"],
    "no-console": "off",
    // Code Performance
    "global-require": "warn",
    // Documentation
    "require-jsdoc": ["warn", {
      "require": {
        "FunctionDeclaration": true,
        "MethodDefinition": false,
        "ClassDeclaration": true,
        "ArrowFunctionExpression": false
      }
    }],
    "valid-jsdoc": ["error", {
      "prefer": {
        "arg": "param",
        "argument": "param",
        "class": "constructor",
        "virtual": "abstract"
      },
      "requireParamDescription": true,
      "requireReturnDescription": true
    }],
    // Unit Tests
    "jest/no-disabled-tests": "warn",
    "jest/no-focused-tests": "error",
    "jest/no-identical-title": "error"
  }
};
