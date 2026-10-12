const configuredBase = import.meta.env.VITE_API_BASE_URL as string | undefined;
const codespaceName = (import.meta.env.VITE_CODESPACE_NAME as string | undefined) || undefined;

export const apiBaseUrl = configuredBase ?? (codespaceName
  ? `https://${codespaceName}-8000.app.github.dev`
  : 'http://localhost:8000');

export async function getJson<T>(path: string): Promise<T> {
  const response = await fetch(`${apiBaseUrl}${path}`);
  if (!response.ok) throw new Error(`Request failed with ${response.status}`);
  return response.json() as Promise<T>;
}
