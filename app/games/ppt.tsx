import { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Image } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

// Opciones de juego
type Option = 'piedra' | 'papel' | 'tijeras' | 'none';

// Reglas del juego: qué opción gana a qué
const rules: Record<Exclude<Option, 'none'>, Option> = {
  'piedra': 'tijeras',
  'papel': 'piedra',
  'tijeras': 'papel'
};

// Emojis para las opciones
const optionEmojis: Record<Option, string> = {
  'piedra': '✊',
  'papel': '✋',
  'tijeras': '✌️',
  'none': '❓'
};

export default function PiedraPapelTijerasScreen() {
  const [playerChoice, setPlayerChoice] = useState<Option>('none');
  const [computerChoice, setComputerChoice] = useState<Option>('none');
  const [result, setResult] = useState<string>('');
  const [scores, setScores] = useState({ player: 0, computer: 0, empates: 0 });
  const [countdown, setCountdown] = useState<number | null>(null);
  
  // Efecto para el contador regresivo cuando el jugador hace su elección
  useEffect(() => {
    if (playerChoice !== 'none' && countdown === null) {
      // Iniciar la cuenta regresiva
      setCountdown(3);
    }
    
    if (countdown !== null && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 500);
      
      return () => clearTimeout(timer);
    }
    
    if (countdown === 0) {
      // Cuando el contador llega a cero, la computadora hace su elección
      playRound();
    }
  }, [playerChoice, countdown]);
  
  // Jugar una ronda
  const playRound = () => {
    // La computadora hace su elección aleatoria
    const options: Exclude<Option, 'none'>[] = ['piedra', 'papel', 'tijeras'];
    const randomChoice = options[Math.floor(Math.random() * options.length)];
    setComputerChoice(randomChoice);
    
    // Determinar el resultado
    if (playerChoice === randomChoice) {
      setResult('¡Empate!');
      setScores(prev => ({ ...prev, empates: prev.empates + 1 }));
    } else if (playerChoice !== 'none' && rules[playerChoice as Exclude<Option, 'none'>] === randomChoice) {
      setResult('¡Ganaste!');
      setScores(prev => ({ ...prev, player: prev.player + 1 }));
    } else {
      setResult('¡Perdiste!');
      setScores(prev => ({ ...prev, computer: prev.computer + 1 }));
    }
  };
  
  // Reiniciar la ronda
  const resetRound = () => {
    setPlayerChoice('none');
    setComputerChoice('none');
    setResult('');
    setCountdown(null);
  };
  
  // Reiniciar el juego completo
  const resetGame = () => {
    resetRound();
    setScores({ player: 0, computer: 0, empates: 0 });
  };
  
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      
      <ThemedView style={styles.header}>
        <ThemedText style={styles.backButton} onPress={() => router.back()}>
          ← Volver
        </ThemedText>
        <ThemedText type="title">Piedra, Papel y Tijeras</ThemedText>
      </ThemedView>
      
      <ThemedView style={styles.gameArea}>
        {/* Área del jugador */}
        <ThemedView style={styles.playerArea}>
          <ThemedText type="subtitle">Tu elección</ThemedText>
          <ThemedText style={styles.choiceEmoji}>
            {playerChoice !== 'none' ? optionEmojis[playerChoice] : '❓'}
          </ThemedText>
        </ThemedView>
        
        {/* Área central / Resultados */}
        <ThemedView style={styles.centerArea}>
          {countdown !== null && countdown > 0 ? (
            <ThemedText style={styles.countdown}>{countdown}</ThemedText>
          ) : result ? (
            <ThemedText style={styles.result}>{result}</ThemedText>
          ) : (
            <ThemedText style={styles.vs}>VS</ThemedText>
          )}
        </ThemedView>
        
        {/* Área de la computadora */}
        <ThemedView style={styles.computerArea}>
          <ThemedText type="subtitle">Computadora</ThemedText>
          <ThemedText style={styles.choiceEmoji}>
            {computerChoice !== 'none' ? optionEmojis[computerChoice] : '❓'}
          </ThemedText>
        </ThemedView>
      </ThemedView>
      
      {/* Controles y opciones de juego */}
      {playerChoice === 'none' ? (
        <ThemedView style={styles.optionsContainer}>
          <ThemedText type="subtitle">Elige tu jugada:</ThemedText>
          <View style={styles.options}>
            <TouchableOpacity 
              style={styles.optionButton} 
              onPress={() => setPlayerChoice('piedra')}
            >
              <ThemedText style={styles.optionEmoji}>{optionEmojis.piedra}</ThemedText>
              <ThemedText>Piedra</ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.optionButton} 
              onPress={() => setPlayerChoice('papel')}
            >
              <ThemedText style={styles.optionEmoji}>{optionEmojis.papel}</ThemedText>
              <ThemedText>Papel</ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.optionButton} 
              onPress={() => setPlayerChoice('tijeras')}
            >
              <ThemedText style={styles.optionEmoji}>{optionEmojis.tijeras}</ThemedText>
              <ThemedText>Tijeras</ThemedText>
            </TouchableOpacity>
          </View>
        </ThemedView>
      ) : (computerChoice !== 'none' && (
        <TouchableOpacity 
          style={styles.playAgainButton} 
          onPress={resetRound}
        >
          <ThemedText style={styles.buttonText}>Jugar de nuevo</ThemedText>
        </TouchableOpacity>
      ))}
      
      {/* Puntuación */}
      <ThemedView style={styles.scoreContainer}>
        <ThemedText type="subtitle">Puntuación</ThemedText>
        <View style={styles.scoreRow}>
          <ThemedView style={styles.scoreItem}>
            <ThemedText>Tú</ThemedText>
            <ThemedText>{scores.player}</ThemedText>
          </ThemedView>
          <ThemedView style={styles.scoreItem}>
            <ThemedText>Empates</ThemedText>
            <ThemedText>{scores.empates}</ThemedText>
          </ThemedView>
          <ThemedView style={styles.scoreItem}>
            <ThemedText>Computadora</ThemedText>
            <ThemedText>{scores.computer}</ThemedText>
          </ThemedView>
        </View>
      </ThemedView>
      
      {/* Botón de reinicio */}
      <TouchableOpacity 
        style={styles.resetButton} 
        onPress={resetGame}
      >
        <ThemedText style={styles.buttonText}>Reiniciar puntuación</ThemedText>
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
  gameArea: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 30,
  },
  playerArea: {
    alignItems: 'center',
    flex: 1,
  },
  computerArea: {
    alignItems: 'center',
    flex: 1,
  },
  centerArea: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 0.5,
  },
  choiceEmoji: {
    fontSize: 64,
    marginTop: 10,
  },
  vs: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  countdown: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  result: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  optionsContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  options: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },
  optionButton: {
    alignItems: 'center',
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    minWidth: 100,
  },
  optionEmoji: {
    fontSize: 36,
    marginBottom: 8,
  },
  playAgainButton: {
    marginTop: 30,
    padding: 15,
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    alignItems: 'center',
    alignSelf: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  scoreContainer: {
    marginTop: 'auto',
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
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#2196F3',
    borderRadius: 8,
    alignItems: 'center',
    alignSelf: 'center',
  },
}); 