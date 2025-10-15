module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    'react-native-worklets/plugin',
    [
      'module-resolver',
      {
        alias: {
          '@app': './src/app',
          '@features': './src/features',
          '@shared': './src/shared',
          '@navigation': './src/navigation',
          '@config': './src/config',
          '@store': './src/store',
          '@assets': './src/shared/assets',
          '@types': './src/types',
        },
      },
    ],
  ],
};
