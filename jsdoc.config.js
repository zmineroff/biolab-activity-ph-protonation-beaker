/**
 * @todo Create a jsdoc-merge based on babel-merge that uses deepmerge.
 *
 * const merge = require('jsdoc-merge');
 */

module.exports = {
  "tags": {
      "allowUnknownTags": true,
      "dictionaries": ["jsdoc"]
  },
  "source": {
      "include": [
          "package.json",
          "README.md",
          "src/sketch.js"
      ],
      "exclude": [
           "node_modules",
           "docs"
      ]
  },
  "plugins": ["plugins/markdown"],
  "opts": {
      "destination": "docs",
      "verbose": true,
      "recurse": false
  }
}
