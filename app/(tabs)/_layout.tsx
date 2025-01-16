import { Tabs, usePathname } from 'expo-router';
import { TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../lib/stores/auth';
import { useChatStore } from '../../lib/stores/chat';
import { useRouter } from 'expo-router';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

export default function TabLayout() {
  const logout = useAuthStore(state => state.logout);
  const { deleteChat, resetContext, chats } = useChatStore();
  const router = useRouter();
  const pathname = usePathname();

  // Получаем заголовок текущего чата
  const getChatTitle = () => {
    if (pathname.includes('/(tabs)/') && pathname !== '/(tabs)/') {
      const chatId = Number(pathname.split('/').pop());
      const currentChat = chats.find(chat => chat.id === chatId);
      return currentChat?.title || 'Чат';
    }
    return 'Чаты';
  };

  return (
    <Tabs screenOptions={({ route }: any) => ({
      headerRight: () => {
        if (route.name === '[id]') {
          return (
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity 
                onPress={() => resetContext(Number(route.params?.id))}
                style={{ marginRight: 16 }}
              >
                <Ionicons name="refresh-outline" size={24} color="#007AFF" />
              </TouchableOpacity>
            </View>
          );
        }
        return (
          <TouchableOpacity onPress={logout} style={{ marginRight: 16 }}>
            <Ionicons name="log-out-outline" size={24} color="#007AFF" />
          </TouchableOpacity>
        );
      },
    })}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Чаты',
          tabBarIcon: ({ color }) => <Ionicons name="chatbubbles-outline" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="[id]"
        options={({ route }) => ({
          title: chats.find(chat => chat.id === Number(route.params?.id))?.title || 'Чат',
          tabBarIcon: ({ color }) => <Ionicons name="chatbubble-outline" size={24} color={color} />,
          tabBarButton: chats.length === 0 ? () => null : undefined,
        })}
      />
    </Tabs>
  );
}
