// module.exports = {
//   presets: ['module:@react-native/babel-preset'],
// };

module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: [
          '.ios.js',
          '.android.js',
          '.js',
          '.jsx',
          '.ts',
          '.tsx',
          '.json'
        ],
        alias: {
          // Add .tsx extensions
          '@components': './src/components',
          '@screens': './src/screens',
          '@navigation': './src/navigation',
          '@context': './src/context/index', // Add /index
          '@services': './src/services',
          '@utils': './src/utils',
          '@assets': './src/assets',
          '@types': './src/types',
          '@styles': './src/styles',
        },
      },
    ],
    // Add this if missing
    // 'react-native-reanimated/plugin', 
  ],
};


// module.exports = {
//   presets: ['module:@react-native/babel-preset'],
//   plugins: [
//     [
//       'module-resolver',
//       {
//         root: ['./src'],
//         alias: {
//           '@components': './src/components',
//           '@screens': './src/screens',
//           '@navigation': './src/navigation',
//           '@context': './src/context',
//           '@services': './src/services',
//           '@utils': './src/utils',
//           '@assets': './src/assets',
//           '@types': './src/types',
//           '@styles': './src/styles',
//         },
//       },
//     ],
//   ],
// };