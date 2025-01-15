import { Tabs } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../lib/stores/auth';

export default function TabLayout() {
  const logout = useAuthStore(state => state.logout);

  return (
    <Tabs screenOptions={{
      headerRight: () => (
        <TouchableOpacity 
          onPress={logout}
          style={{ marginRight: 16 }}
        >
          <Ionicons name="log-out-outline" size={24} color="#007AFF" />
        </TouchableOpacity>
      ),
    }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Чаты',
        }}
      />
    </Tabs>
  );
}
