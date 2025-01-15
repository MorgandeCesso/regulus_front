import { useEffect, useRef, useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, Alert, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useMessageStore } from '../../lib/stores/message';
import { ThemedView } from '../../components/ThemedView';
import { ThemedText } from '../../components/ThemedText';
import { Message } from '../../lib/types/message';
import * as DocumentPicker from 'expo-document-picker';

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const chatId = parseInt(id);
  const inputRef = useRef<TextInput>(null);
  const [message, setMessage] = useState('');
  const { messages, total, isLoading, isTyping, error, loadMessages, sendMessage, uploadFile } = useMessageStore();
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    loadMessages(chatId);
    return () => {
      useMessageStore.getState().clearState();
    };
  }, [chatId]);

  const handleSend = async () => {
    if (!message.trim()) return;
    await sendMessage(chatId, message.trim());
    setMessage('');
    inputRef.current?.clear();
  };

  const handleUpload = async () => {
    try {
      setIsUploading(true);
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          'application/pdf',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'text/plain'
        ],
        copyToCacheDirectory: true
      });
      
      if (!result.canceled) {
        const formData = new FormData();
        formData.append('file', {
          uri: result.assets[0].uri,
          name: result.assets[0].name,
          type: result.assets[0].mimeType || 'application/octet-stream'
        } as any);
        
        await uploadFile(chatId, formData);
        Alert.alert('Успех', 'Файл успешно добавлен в базу знаний');
      }
    } catch (error) {
      console.error('Upload error:', error);
      Alert.alert('Ошибка', 'Не удалось загрузить файл. Попробуйте еще раз.');
    } finally {
      setIsUploading(false);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <ThemedView style={[
      styles.messageContainer,
      item.is_sent_by_bot ? styles.botMessage : styles.userMessage
    ]}>
      <ThemedText style={styles.messageText}>{item.content}</ThemedText>
      <ThemedText style={styles.messageTime}>
        {new Date(item.created_at).toLocaleTimeString()}
      </ThemedText>
    </ThemedView>
  );

  if (error) {
    return (
      <ThemedView style={styles.centerContainer}>
        <ThemedText style={styles.error}>{error}</ThemedText>
      </ThemedView>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ThemedView style={styles.uploadSection}>
        <TouchableOpacity 
          style={[styles.uploadButton, isUploading && styles.uploadButtonDisabled]}
          onPress={handleUpload}
          disabled={isUploading}
        >
          {isUploading ? (
            <ActivityIndicator color="#007AFF" style={styles.uploadIcon} />
          ) : (
            <Ionicons 
              name="document-attach" 
              size={24} 
              color="#007AFF" 
              style={styles.uploadIcon}
            />
          )}
          <ThemedText style={[styles.uploadText, isUploading && styles.uploadTextDisabled]}>
            {isUploading ? 'Загрузка файла...' : 'Добавить файл в базу знаний'}
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>

      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContent}
        inverted={false}
        onEndReached={() => {
          if (!isLoading && messages.length < total) {
            loadMessages(chatId, messages.length);
          }
        }}
        onEndReachedThreshold={0.3}
        ListFooterComponent={isTyping ? (
          <ThemedView style={styles.typingContainer}>
            <ThemedText style={styles.typingText}>Regulus печатает...</ThemedText>
          </ThemedView>
        ) : null}
      />

      <ThemedView style={styles.inputContainer}>
        <TextInput
          ref={inputRef}
          style={styles.input}
          placeholder="Введите сообщение..."
          placeholderTextColor="#666"
          value={message}
          onChangeText={setMessage}
          multiline
        />
        <TouchableOpacity 
          style={styles.sendButton}
          onPress={handleSend}
          disabled={isLoading}
        >
          <Ionicons 
            name="send" 
            size={24} 
            color={isLoading ? '#666' : '#007AFF'} 
          />
        </TouchableOpacity>
      </ThemedView>
    </KeyboardAvoidingView>
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
  listContent: {
    padding: 16,
  },
  messageContainer: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
    marginBottom: 8,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#007AFF',
  },
  botMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#E9E9EB',
  },
  messageText: {
    fontSize: 16,
    color: '#000',
  },
  messageTime: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: '#E9E9EB',
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    backgroundColor: '#F2F2F7',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    fontSize: 16,
  },
  sendButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    color: '#ff3b30',
    textAlign: 'center',
    margin: 16,
  },
  typingContainer: {
    padding: 8,
    marginBottom: 8,
  },
  typingText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  uploadSection: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E9E9EB',
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    padding: 12,
    borderRadius: 8,
  },
  uploadText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#007AFF',
  },
  uploadButtonDisabled: {
    opacity: 0.6,
  },
  uploadTextDisabled: {
    opacity: 0.6,
  },
  uploadIcon: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
}); 