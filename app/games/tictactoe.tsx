import { useCallback, useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

type Player = 'X' | 'O' | null;
type Board = Player[][];

// Función para inicializar el tablero de juego vacío (3x3)
const createBoard = (): Board => [
  [null, null, null],
  [null, null, null],
  [null, null, null],
];

// Verifica si hay un ganador en el tablero actual
const checkWinner = (board: Board): Player => {
  // Verificar filas
  for (let i = 0; i < 3; i++) {
    if (board[i][0] && board[i][0] === board[i][1] && board[i][0] === board[i][2]) {
      return board[i][0];
    }
  }

  // Verificar columnas
  for (let i = 0; i < 3; i++) {
    if (board[0][i] && board[0][i] === board[1][i] && board[0][i] === board[2][i]) {
      return board[0][i];
    }
  }

  // Verificar diagonal principal
  if (board[0][0] && board[0][0] === board[1][1] && board[0][0] === board[2][2]) {
    return board[0][0];
  }

  // Verificar diagonal secundaria
  if (board[0][2] && board[0][2] === board[1][1] && board[0][2] === board[2][0]) {
    return board[0][2];
  }

  // No hay ganador
  return null;
};

// Verifica si el tablero está lleno (empate)
const isBoardFull = (board: Board): boolean => {
  for (let row of board) {
    for (let cell of row) {
      if (cell === null) return false;
    }
  }
  return true;
};

export default function TicTacToeScreen() {
  const [board, setBoard] = useState<Board>(createBoard());
  const [currentPlayer, setCurrentPlayer] = useState<'X' | 'O'>('X');
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [scores, setScores] = useState({ X: 0, O: 0, empates: 0 });

  // Maneja el toque en una celda del tablero
  const handleCellPress = (row: number, col: number) => {
    if (board[row][col] || gameOver) return;

    // Copia el tablero para la inmutabilidad
    const newBoard = [...board.map(row => [...row])];
    newBoard[row][col] = currentPlayer;
    setBoard(newBoard);

    // Verifica si hay un ganador
    const winner = checkWinner(newBoard);
    if (winner) {
      setGameOver(true);
      const newScores = { ...scores };
      newScores[winner]++;
      setScores(newScores);
      
      Alert.alert(
        "¡Juego terminado!",
        `¡El jugador ${winner} ha ganado!`,
        [{ text: "Nueva partida", onPress: resetGame }]
      );
      return;
    }

    // Verifica si hay empate
    if (isBoardFull(newBoard)) {
      setGameOver(true);
      setScores({ ...scores, empates: scores.empates + 1 });
      
      Alert.alert(
        "¡Juego terminado!",
        "¡Empate!",
        [{ text: "Nueva partida", onPress: resetGame }]
      );
      return;
    }

    // Cambia de jugador
    setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
  };

  // Reinicia el juego
  const resetGame = useCallback(() => {
    setBoard(createBoard());
    setCurrentPlayer('X');
    setGameOver(false);
  }, []);

  // Renderiza una celda del tablero
  const renderCell = (row: number, col: number) => {
    const cellValue = board[row][col];
    return (
      <TouchableOpacity 
        style={styles.cell} 
        onPress={() => handleCellPress(row, col)}
        activeOpacity={0.7}
      >
        <ThemedText style={[
          styles.cellText, 
          cellValue === 'X' ? styles.xText : styles.oText
        ]}>
          {cellValue}
        </ThemedText>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      
      <ThemedView style={styles.header}>
        <ThemedText style={styles.backButton} onPress={() => router.back()}>
          ← Volver
        </ThemedText>
        <ThemedText type="title">Tic Tac Toe</ThemedText>
      </ThemedView>
      
      <ThemedView style={styles.gameStatus}>
        <ThemedText type="subtitle">
          Turno del jugador: <ThemedText style={currentPlayer === 'X' ? styles.xText : styles.oText}>
            {currentPlayer}
          </ThemedText>
        </ThemedText>
      </ThemedView>
      
      <ThemedView style={styles.board}>
        <View style={styles.row}>
          {renderCell(0, 0)}
          {renderCell(0, 1)}
          {renderCell(0, 2)}
        </View>
        <View style={styles.row}>
          {renderCell(1, 0)}
          {renderCell(1, 1)}
          {renderCell(1, 2)}
        </View>
        <View style={styles.row}>
          {renderCell(2, 0)}
          {renderCell(2, 1)}
          {renderCell(2, 2)}
        </View>
      </ThemedView>
      
      <ThemedView style={styles.scoreContainer}>
        <ThemedText type="subtitle">Puntuación</ThemedText>
        <View style={styles.scoreRow}>
          <ThemedView style={styles.scoreItem}>
            <ThemedText style={styles.xText}>X</ThemedText>
            <ThemedText>{scores.X}</ThemedText>
          </ThemedView>
          <ThemedView style={styles.scoreItem}>
            <ThemedText style={styles.oText}>O</ThemedText>
            <ThemedText>{scores.O}</ThemedText>
          </ThemedView>
          <ThemedView style={styles.scoreItem}>
            <ThemedText>Empates</ThemedText>
            <ThemedText>{scores.empates}</ThemedText>
          </ThemedView>
        </View>
      </ThemedView>
      
      <TouchableOpacity style={styles.resetButton} onPress={resetGame}>
        <ThemedText style={styles.resetButtonText}>Reiniciar partida</ThemedText>
      </TouchableOpacity>
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
  gameStatus: {
    alignItems: 'center',
    marginBottom: 20,
  },
  board: {
    alignSelf: 'center',
    marginVertical: 20,
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    width: 90,
    height: 90,
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cellText: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  xText: {
    color: '#FF5252',
  },
  oText: {
    color: '#4CAF50',
  },
  scoreContainer: {
    marginTop: 30,
    alignItems: 'center',
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 10,
  },
  scoreItem: {
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    minWidth: 80,
  },
  resetButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#2196F3',
    borderRadius: 8,
    alignItems: 'center',
    alignSelf: 'center',
  },
  resetButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
}); 