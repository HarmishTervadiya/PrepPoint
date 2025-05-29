const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Add path alias resolver
config.resolver.alias = {
  '@': path.resolve(__dirname, './'),
  '@/api': path.resolve(__dirname, './api'),
  '@/components': path.resolve(__dirname, './components'),
  '@/utils': path.resolve(__dirname, './utils'),
  '@/redux-toolkit': path.resolve(__dirname, './redux-toolkit'),
  '@/types': path.resolve(__dirname, './types'),
  '@/assets': path.resolve(__dirname, './assets'),
  '@/themes': path.resolve(__dirname, './themes'),
  '@/constants': path.resolve(__dirname, './constants'),
  '@/hooks': path.resolve(__dirname, './hooks'),
};

module.exports = config;