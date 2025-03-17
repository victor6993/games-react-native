export interface Game {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export const GAMES: Game[] = [
  { 
    id: '1', 
    name: 'Tic Tac Toe', 
    icon: '❌⭕', 
    description: 'Juego clásico de tres en raya donde gana quien forma una línea.' 
  },
  { 
    id: '2', 
    name: 'Piedra, Papel y Tijeras', 
    icon: '✊✋✌️', 
    description: 'Elige tu jugada y compite contra la computadora.' 
  },
]; 