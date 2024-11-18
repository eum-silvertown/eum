module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: [
          '.ios.ts',
          '.android.ts',
          '.ts',
          '.ios.tsx',
          '.android.tsx',
          '.tsx',
          '.jsx',
          '.js',
          '.json',
        ],
        alias: {
          '@components': './src/components',
          '@screens': './src/screens',
          '@assets': './src/assets',
          '@theme': './src/theme',
          '@utils': './src/utils',
          '@store': './src/store',
          '@services': './src/services',
          '@hooks': './src/hooks',
          '@contexts': './src/contexts',
          '~types': './src/types',
        },
      },
    ],
    'react-native-reanimated/plugin',
  ],
};
