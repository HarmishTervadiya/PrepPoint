import * as SecureStore from 'expo-secure-store';

export const saveAuthData = async (
  userId: string,
  accessToken: string,
  refreshToken: string,
) => {
  try {
    await SecureStore.setItemAsync('userId', userId);
    await SecureStore.setItemAsync('accessToken', accessToken);
    await SecureStore.setItemAsync('refreshToken', refreshToken);
    console.log('Auth data saved successfully');
  } catch (error) {
    console.error('Error saving auth data:', error);
    throw new Error('Failed to save authentication data.');
  }
};

export const getAuthData = async () => {
  try {
    const userId = await SecureStore.getItemAsync('userId');
    const accessToken = await SecureStore.getItemAsync('accessToken');
    const refreshToken = await SecureStore.getItemAsync('refreshToken');
    
    if (!userId || !accessToken || !refreshToken) {
      throw new Error('Missing authentication data');
    }
    
    return { userId, accessToken, refreshToken };
  } catch (error) {
    console.error('Error retrieving auth data:', error);
    return null;
  }
};

export const clearAuthData = async () => {
  try {
    await SecureStore.deleteItemAsync('userId');
    await SecureStore.deleteItemAsync('accessToken');
    await SecureStore.deleteItemAsync('refreshToken');
    console.log('Auth data cleared successfully');
  } catch (error) {
    console.error('Error clearing auth data:', error);
    throw new Error('Failed to clear authentication data.');
  }
};