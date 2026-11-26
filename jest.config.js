module.exports = {
  detectOpenHandles: true,
  forceExit: true,
  projects: [
    {
      displayName: 'react-native-mmkv',
      testMatch: ['<rootDir>/packages/react-native-mmkv/src/**/__tests__/**/*.(ts|tsx|js)', '<rootDir>/packages/react-native-mmkv/src/**/*.(test|spec).(ts|tsx|js)'],
      preset: '@react-native/jest-preset',
      testEnvironmentOptions: {
        customExportConditions: ['react-native', 'react-native-mmkv-mock']
      },
      transform: {
        '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest'
      },
      transformIgnorePatterns: [
        'node_modules/(?!(react-native|@react-native|react-native-.*)/)'
      ],
      moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
      testPathIgnorePatterns: ['<rootDir>/packages/react-native-mmkv/lib/'],
      collectCoverageFrom: [
        'packages/react-native-mmkv/src/**/*.{ts,tsx}',
        '!packages/react-native-mmkv/src/**/*.d.ts'
      ]
    },
  ]
}
