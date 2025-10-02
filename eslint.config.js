import { configApp } from '@adonisjs/eslint-config'
export default configApp({
  rules: {
    '@unicorn/filename-case': [
      'error',
      {
        cases: {
          pascalCase: true,
          camelCase: true,
          snakeCase: false,
          kebabCase: false,
        },
      },
    ],
  },
})
