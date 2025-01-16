import { useEffect, useState } from 'react';
import { StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useChatStore } from '../../lib/stores/chat';
import { ThemedView } from '../../components/ThemedView';
import { ThemedText } from '../../components/ThemedText';
import { Chat } from '../../lib/types/chat';
import { Swipeable } from 'react-native-gesture-handler';

export default function ChatListScreen() {
  const router = useRouter();
  const { chats, total, isLoading, error, loadChats, createChat, deleteChat } = useChatStore();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadChats();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadChats(0);  // загружаем с начала
    setRefreshing(false);
  };

  const handleCreateChat = async () => {
    await createChat('');
  };

  const renderRightActions = (chatId: number) => (
    <TouchableOpacity 
      style={styles.deleteAction}
      onPress={() => deleteChat(chatId)}
    >
      <Ionicons name="trash-outline" size={24} color="#fff" />
    </TouchableOpacity>
  );

  const renderItem = ({ item }: { item: Chat }) => (
    <Swipeable
      renderRightActions={() => renderRightActions(item.id)}
    >
      <TouchableOpacity 
        style={styles.chatItem}
        onPress={() => router.push(`/(tabs)/${item.id}` as never)}
      >
        <ThemedText style={styles.chatTitle}>{item.title}</ThemedText>
        <ThemedText style={styles.chatDate}>
          {new Date(item.updated_at).toLocaleDateString()}
        </ThemedText>
      </TouchableOpacity>
    </Swipeable>
  );

  const handleLoadMore = () => {
    if (!isLoading && chats.length < total) {
      loadChats(chats.length);
    }
  };

  if (error) {
    return (
      <ThemedView style={styles.centerContainer}>
        <ThemedText style={styles.error}>{error}</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <FlatList
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#007AFF']}  // для Android
            tintColor="#007AFF"   // для iOS
          />
        }
        data={chats}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.3}
        ListEmptyComponent={
          !isLoading ? (
            <ThemedText style={styles.emptyText}>
              Нет доступных чатов
            </ThemedText>
          ) : null
        }
        ListFooterComponent={
          isLoading ? (
            <ActivityIndicator style={styles.loader} />
          ) : null
        }
      />

      <TouchableOpacity 
        style={styles.fab}
        onPress={handleCreateChat}
        disabled={isLoading}
      >
        <Ionicons name="add" size={30} color="#fff" />
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  chatTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  chatDate: {
    fontSize: 12,
    color: '#666',
  },
  error: {
    color: '#ff3b30',
    textAlign: 'center',
    margin: 16,
  },
  emptyText: {
    textAlign: 'center',
    margin: 16,
    color: '#666',
  },
  loader: {
    padding: 16,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  deleteAction: {
    backgroundColor: '#ff3b30',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '100%',
  },
});
