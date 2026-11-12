// Os caminhos relativos /api passam pelo proxy Vite e chegam à API na porta 8000.
export const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? '';

export async function getJson<T>(path: string): Promise<T> {
  const response = await fetch(`${apiBaseUrl}${path}`);
  if (!response.ok) throw new Error(`Falha na requisição (${response.status})`);
  return response.json() as Promise<T>;
}
