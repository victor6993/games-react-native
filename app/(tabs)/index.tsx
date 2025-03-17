import { StyleSheet, FlatList } from 'react-native';
import { View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { router } from 'expo-router';
import { GAMES, Game } from '../../constants/Games';

// Componente para la tarjeta de juego
const GameCard = ({ game }: { game: Game }) => {
  // Función para navegar directamente al juego correspondiente
  const navigateToGame = () => {
    switch (game.id) {
      case '1': // Tic Tac Toe
        router.push('/games/tictactoe');
        break;
      case '2': // Piedra, Papel y Tijeras
        router.push('/games/ppt');
        break;
      default:
        // Si no hay implementación específica, usa la ruta dinámica
        router.push(`/games/${game.id}`);
    }
  };

  return (
    <ThemedView style={styles.card} onTouchEnd={navigateToGame}>
      <ThemedText style={styles.gameIcon}>{game.icon}</ThemedText>
      <ThemedText type="subtitle">{game.name}</ThemedText>
    </ThemedView>
  );
};

export default function GamesScreen() {
  return (
    <View style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">Juegos</ThemedText>
      </ThemedView>
      
      <FlatList
        data={GAMES}
        renderItem={({ item }) => <GameCard game={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginVertical: 16,
  },
  list: {
    gap: 16,
  },
  card: {
    padding: 20,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
  },
  gameIcon: {
    fontSize: 24,
  }
});
