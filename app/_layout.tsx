import { useEffect } from 'react';
import { Slot, useRouter, useSegments } from 'expo-router';
import { useAuthStore } from '../lib/stores/auth';

export default function RootLayout() {
  const segments = useSegments();
  const router = useRouter();
  const { user } = useAuthStore();

  useEffect(() => {
    const inAuthGroup = segments[0] as string === '(auth)';
    
    if (!user && !inAuthGroup) {
      router.replace('/login' as never);
    } else if (user && inAuthGroup) {
      router.replace('/(tabs)' as never);
    }
  }, [user, segments]);

  return <Slot />;
}
