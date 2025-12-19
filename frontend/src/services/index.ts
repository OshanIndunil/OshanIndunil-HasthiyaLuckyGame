const API_BASE_URL = "http://localhost:3000/api";

interface ResponseData {
  status: number;
  data: any;
  message?: string;
}

// Start Game Session
const startGame = async (email: string) => {
  let data: ResponseData;
  try {
    const response = await fetch(`${API_BASE_URL}/start-game`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });
    if (!response.ok) {
      data = {
        status: response.status,
        data: null,
        message: "Game already played with this email.",
      };
      return data;
    }
    data = { status: response.status, data: await response.json() };
    return data;
  } catch (error) {
    console.error("Failed to start game", error);
    data = {
      status: 500,
      data: null,
      message: "Server error. Please try again.",
    };
    return data;
  }
};

// Submit Game Score
const submitScore = async (email: string, generatedNumbers: number[]) => {
 let data: ResponseData;
  try {
    const response = await fetch(`${API_BASE_URL}/submit-score`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, generatedNumbers }),
    });
    if (!response.ok) {
      data = {
        status: response.status,
        data: null,
        message: "Failed to submit score.",
      };
      return data;
    }
    data = { status: response.status, data: await response.json() };
    return data;
  } catch (error) {
    console.error("Failed to submit score", error);
    data = {
      status: 500,
      data: null,
      message: "Server error. Please try again.",
    };
    return data;
  }
};

// Get Leaderboard Data
const getLeaderboard = async (page: number) => {
  let data: ResponseData;
  try {
    const response = await fetch(`${API_BASE_URL}/leaderboard?page=${page}`);
    if (!response.ok) {
      data = {
        status: response.status,
        data: null,
        message: "Failed to fetch leaderboard.",
      };
        return data;
    }
    data = { status: response.status, data: await response.json() };
    return data;
  } catch (error) {
    console.error("Failed to fetch leaderboard", error);
    data = {
      status: 500,
      data: null,
      message: "Server error. Please try again.",
    };
    return data;
  }
};

export { startGame, submitScore, getLeaderboard };
