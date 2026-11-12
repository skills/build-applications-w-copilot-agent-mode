import { Link, Navigate, Route, Routes } from 'react-router-dom';
import Activities from './components/Activities.js';
import Teams from './components/Teams.js';
import Leaderboard from './components/Leaderboard.js';
import Workouts from './components/Workouts.js';

export default function App() {
  return <div className="container py-4"><header className="mb-4"><h1>OctoFit Tracker</h1><nav aria-label="Seções do OctoFit" className="d-flex gap-3 flex-wrap"><Link to="/activities">Atividades</Link><Link to="/teams">Equipes</Link><Link to="/leaderboard">Placar</Link><Link to="/workouts">Sugestões de treino</Link></nav></header><Routes><Route path="/" element={<Navigate to="/activities" replace />} /><Route path="/activities" element={<Activities />} /><Route path="/teams" element={<Teams />} /><Route path="/leaderboard" element={<Leaderboard />} /><Route path="/workouts" element={<Workouts />} /></Routes></div>;
}
