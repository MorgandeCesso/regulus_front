import { useEffect } from 'react';
import { Slot, useRouter, useSegments } from 'expo-router';
import { useAuthStore } from '../lib/stores/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';

export default function RootLayout() {
  const segments = useSegments();
  const router = useRouter();
  const { user } = useAuthStore();

  useEffect(() => {
    // Проверяем токен при запуске
    const checkToken = async () => {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token && segments[0] !== '(auth)') {
        router.replace('/login' as never);
      }
    };
    
    checkToken();
  }, []); // Запускаем только при монтировании

  useEffect(() => {
    const inAuthGroup = segments[0] === '(auth)';
    
    if (!user && !inAuthGroup) {
      router.replace('/login' as never);
    } else if (user && inAuthGroup) {
      router.replace('/(tabs)' as never);
    }
  }, [user, segments]);

  return (
    <GestureHandlerRootView style={styles.container}>
      <Slot />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
