const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const ESLintPlugin = require('eslint-webpack-plugin')
const paths = require('./paths')

module.exports = {
  // Where webpack looks to start building the bundle
  entry: {
    'eins-modal': paths.src + '/index.js',
    'eins-modal-plain': paths.src + '/index-plain.js'
  },

  // Where webpack outputs the assets and bundles
  output: {
    path: paths.build,
    filename: '[name].min.js',
    publicPath: '',
    environment: {
      // The environment supports arrow functions ('() => { ... }').
      arrowFunction: false,
      // The environment supports BigInt as literal (123n).
      bigIntLiteral: false,
      // The environment supports const and let for variable declarations.
      const: false,
      // The environment supports destructuring ('{ a, b } = obj').
      destructuring: false,
      // The environment supports an async import() function to import EcmaScript modules.
      dynamicImport: false,
      // The environment supports 'for of' iteration ('for (const x of array) { ... }').
      forOf: false,
      // The environment supports ECMAScript Module syntax to import ECMAScript modules (import ... from '...').
      module: false
    }
  },

  // Customize the webpack build process
  plugins: [
    // Removes/cleans build folders and unused assets when rebuilding
    new CleanWebpackPlugin(),

    // ESLint configuration
    new ESLintPlugin({
      files: [ '.', 'src', 'config' ],
      formatter: 'table'
    })
  ],

  // Determine how modules within the project are treated
  module: {
    rules: [
      // JavaScript: Use Babel to transpile JavaScript files
      { test: /\.js$/, use: [ 'babel-loader' ] },

      // Images: Copy image files to build folder
      { test: /\.(?:ico|gif|png|jpg|jpeg)$/i, type: 'asset/resource' },

      // Fonts and SVGs: Inline files
      { test: /\.(woff(2)?|eot|ttf|otf|svg|)$/, type: 'asset/inline' }
    ]
  }
}
