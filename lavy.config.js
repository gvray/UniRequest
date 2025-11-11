import { defineConfig } from 'lavy'

export default defineConfig({
  "project": {
    "language": "ts",
    "framework": "none",
    "style": "none",
    "linter": "eslint",
    "platform": "browser"
  },
  "lint": {
    "eslint": {
      "enabled": true,
      "config": "eslint.config.js"
    },
    "stylelint": {
      "enabled": false,
      "config": "stylelint.config.js"
    },
    "prettier": {
      "enabled": true,
      "config": "prettier.config.js"
    },
    "biome": {
      "enabled": false,
      "config": "biome.json"
    }
  }
})
