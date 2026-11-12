import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from '../src/App.js';

function renderRoute(route: string) {
  return render(<MemoryRouter initialEntries={[route]}><App /></MemoryRouter>);
}

const capabilities = [
  { route: '/activities', empty: { activities: [] }, emptyText: /sem atividades|nenhuma atividade/i },
  { route: '/teams', empty: { teams: [] }, emptyText: /sem equipes|nenhuma equipe/i },
  { route: '/leaderboard', empty: { leaderboard: [] }, emptyText: /sem placar|sem classificação|sem pontuação/i },
  { route: '/workouts', empty: { suggestions: [] }, emptyText: /sem sugestões|nenhuma sugestão/i },
];

describe('Contrato de apresentação do OctoFit', () => {
  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  beforeEach(() => {
    vi.restoreAllMocks();
    vi.stubGlobal('fetch', vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input);
      if (url.includes('/api/activities')) return new Response(JSON.stringify({ activities: [{ type: 'run', minutes: 30, points: 30 }] }), { status: 200 });
      if (url.includes('/api/teams')) return new Response(JSON.stringify({ teams: [{ name: 'Octocats', members: ['Mona'] }] }), { status: 200 });
      if (url.includes('/api/leaderboard')) return new Response(JSON.stringify({ leaderboard: [{ teamName: 'Octocats', totalPoints: 90, rank: 1 }] }), { status: 200 });
      if (/\/api\/workouts\/suggestions\/mona(%40|@)example\.com$/.test(url)) return new Response(JSON.stringify({ suggestions: [{ title: 'Intervalos', reason: 'Desenvolva sua resistência' }] }), { status: 200 });
      return new Response(JSON.stringify({ message: 'Não encontrado' }), { status: 404 });
    }));
  });

  it('exibe dados de atividades retornados pela API', async () => {
    renderRoute('/activities');
    expect(screen.getByRole('heading', { name: /atividades/i })).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText(/corrida/i)).toBeInTheDocument());
  });

  it('exibe equipes, placar e sugestões de treino com conteúdo acessível', async () => {
    const teams = renderRoute('/teams');
    await waitFor(() => expect(screen.getByText(/Octocats/)).toBeInTheDocument());
    teams.unmount();
    const leaderboard = renderRoute('/leaderboard');
    await waitFor(() => expect(screen.getByText(/90/)).toBeInTheDocument());
    leaderboard.unmount();
    renderRoute('/workouts');
    await waitFor(() => expect(screen.getByText(/Intervalos/)).toBeInTheDocument());
  });

  it('solicita sugestões de treino para uma pessoa específica', async () => {
    renderRoute('/workouts');
    await waitFor(() => expect(fetch).toHaveBeenCalledWith(expect.stringMatching(/\/api\/workouts\/suggestions\/mona(%40|@)example\.com$/)));
  });

  for (const capability of capabilities) {
    describe(capability.route, () => {
      it('anuncia o carregamento enquanto aguarda a API', () => {
        vi.stubGlobal('fetch', vi.fn(() => new Promise<Response>(() => {})));
        renderRoute(capability.route);
        expect(screen.getByRole('status')).toHaveTextContent(/carregando/i);
      });

      it('exibe um estado vazio significativo', async () => {
        vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify(capability.empty), { status: 200 })));
        renderRoute(capability.route);
        await waitFor(() => expect(screen.getByText(capability.emptyText)).toBeInTheDocument());
      });

      it('anuncia falhas da API em um alerta acessível', async () => {
        vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify({ message: 'Indisponível' }), { status: 503 })));
        renderRoute(capability.route);
        await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent(/não foi possível|indisponível|erro/i));
      });
    });
  }
});
