const API_BASE_URL = import.meta.env.VITE_API_URL;

export async function fetchState() {
  const response = await fetch(`${API_BASE_URL}/state`);

  if (!response.ok) {
    throw new Error("Failed to load saved state");
  }

  return response.json();
}

export async function saveState(tasks, catProfile) {
  const response = await fetch(`${API_BASE_URL}/state`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tasks, catProfile }),
  });

  if (!response.ok) {
    throw new Error("Failed to save state");
  }

  return response.json();
}