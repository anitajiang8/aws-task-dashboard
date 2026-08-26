const API_BASE_URL = import.meta.env.VITE_API_URL;

/**
 * Local development can run against generated sample data instead of the
 * real backend. Set VITE_USE_MOCK=true to build and screenshot the charts
 * without issuing a single API Gateway request.
 */
const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";

let mockState = null;

async function getMockState() {
  if (!mockState) {
    const { generateSeedState } = await import("./lib/seed");
    mockState = generateSeedState();
  }
  return mockState;
}

export async function fetchState() {
  if (USE_MOCK) {
    return getMockState();
  }

  const response = await fetch(`${API_BASE_URL}/state`);

  if (!response.ok) {
    throw new Error("Failed to load saved state");
  }

  return response.json();
}

export async function saveState(tasks, catProfile) {
  if (USE_MOCK) {
    mockState = { tasks, catProfile };
    return mockState;
  }

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
