import { getEnvVariables } from '../helpers/getEnvVariables';

const baseUrl = getEnvVariables().VITE_HEARMEOUT_API;

interface ISignIn {
  username: string;
  password: string;
}

interface ISignUp {
  username: string;
  password: string;
}

export async function signIn({ username, password }: ISignIn) {
  try {
    const response = await fetch(`${baseUrl}/auth/sign-in`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });
    const data = await response.json();
    return data;
  } catch (error) {
    return null;
  }
}

export async function signUp({ username, password }: ISignUp) {
  try {
    const response = await fetch(`${baseUrl}/auth/sign-up`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });
    const data = await response.json();
    return data;
  } catch (error) {
    return null;
  }
}

export async function signOut() {
  try {
    const response = await fetch(`${baseUrl}/auth/sign-out`, {
      credentials: 'include'
    });
    const data = await response.json();
    return data;
  } catch (error) {
    return null;
  }
}

export async function verify() {
  try {
    const response = await fetch(`${baseUrl}/auth/verify`, {
      credentials: 'include'
    });
    const data = await response.json();
    const isVerified = response.status === 200;

    if (!isVerified) {
      return null;
    }

    return data;
  } catch (error) {
    return null;
  }
}
