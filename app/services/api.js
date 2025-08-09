import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const API_BASE_URL = __DEV__ 
  ? 'http://192.168.1.102:3000/api'  // Your PC's local IP
  : 'https://your-production-api.com/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async getAuthToken() {
    try {
      return await AsyncStorage.getItem('authToken');
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
    }
  }

  async setAuthToken(token) {
    try {
      await AsyncStorage.setItem('authToken', token);
    } catch (error) {
      console.error('Error setting auth token:', error);
    }
  }

  async removeAuthToken() {
    try {
      await AsyncStorage.removeItem('authToken');
    } catch (error) {
      console.error('Error removing auth token:', error);
    }
  }

  async makeRequest(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = await this.getAuthToken();
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Auth endpoints
  async register(userData) {
    return this.makeRequest('/auth/register', {
      method: 'POST',
      body: userData,
    });
  }

  async login(credentials) {
    return this.makeRequest('/auth/login', {
      method: 'POST',
      body: credentials,
    });
  }

  async getProfile() {
    return this.makeRequest('/auth/profile', {
      method: 'GET',
    });
  }

  // User endpoints
  async updateProfile(userData) {
    return this.makeRequest('/users/profile', {
      method: 'PUT',
      body: userData,
    });
  }

  // Game endpoints
  async startGame(gameData) {
    return this.makeRequest('/games/start', {
      method: 'POST',
      body: gameData,
    });
  }

  async submitAnswer(gameId, answerData) {
    return this.makeRequest(`/games/${gameId}/answer`, {
      method: 'POST',
      body: answerData,
    });
  }

  async endGame(gameId, gameData) {
    return this.makeRequest(`/games/${gameId}/end`, {
      method: 'POST',
      body: gameData,
    });
  }

  // Leaderboard endpoints
  async getLeaderboard(type = 'global', limit = 10) {
    return this.makeRequest(`/leaderboard?type=${type}&limit=${limit}`, {
      method: 'GET',
    });
  }

  // Questions endpoints
  async getQuestions(categoryId, difficulty) {
    const params = new URLSearchParams();
    if (categoryId) params.append('categoryId', categoryId);
    if (difficulty) params.append('difficulty', difficulty);
    
    return this.makeRequest(`/questions?${params.toString()}`, {
      method: 'GET',
    });
  }
}

export default new ApiService();