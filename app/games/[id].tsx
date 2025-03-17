import { StyleSheet, View } from 'react-native';
import { useEffect } from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { GAMES, Game } from '../../constants/Games';

export default function GameRedirectScreen() {
  const { id } = useLocalSearchParams();
  const game = GAMES.find((g: Game) => g.id === id);
  
  useEffect(() => {
    // Redirigir a los juegos específicos según el ID
    if (game) {
      switch (game.id) {
        case '1': // Tic Tac Toe
          router.replace('/games/tictactoe');
          break;
        case '2': // Piedra, Papel y Tijeras
          router.replace('/games/ppt');
          break;
        default:
          // Si aún no hay implementación del juego, mostrar detalles
          break;
      }
    }
  }, [game]);

  // Si no se encuentra el juego o está en proceso de redirección, mostrar pantalla de carga
  if (!game) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText type="title">Juego no encontrado</ThemedText>
        <ThemedView style={styles.button} onTouchEnd={() => router.back()}>
          <ThemedText>Volver a la lista</ThemedText>
        </ThemedView>
      </ThemedView>
    );
  }

  // Pantalla de detalles como fallback si no hay implementación del juego
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <ThemedView style={styles.header}>
        <ThemedText style={styles.backButton} onPress={() => router.back()}>← Volver</ThemedText>
        <ThemedText type="title">{game.name}</ThemedText>
        <ThemedText style={styles.icon}>{game.icon}</ThemedText>
      </ThemedView>
      
      <ThemedView style={styles.content}>
        <ThemedText type="subtitle">Descripción</ThemedText>
        <ThemedText>{game.description}</ThemedText>
      </ThemedView>
      
      <ThemedView style={styles.actionButton}>
        <ThemedText style={styles.buttonText}>Próximamente</ThemedText>
      </ThemedView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginTop: 40,
    marginBottom: 20,
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    left: 0,
    top: 10,
    fontSize: 16,
  },
  icon: {
    fontSize: 64,
    marginVertical: 20,
  },
  content: {
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  button: {
    marginTop: 20,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButton: {
    marginTop: 'auto',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  }
}); 