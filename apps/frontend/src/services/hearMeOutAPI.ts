import { getEnvVariables } from '../helpers/getEnvVariables';
import { HttpStatusCodes } from '../types/types';

const baseUrl = getEnvVariables().VITE_HEARMEOUT_API;

interface ISignIn {
  username: string;
  password: string;
}

interface ISignUp {
  username: string;
  password: string;
}

interface IResponseData {
  data: any;
  status: number;
}

export async function signIn({
  username,
  password
}: ISignIn): Promise<IResponseData> {
  try {
    const response = await fetch(`${baseUrl}/auth/sign-in`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });
    const data = await response.json();

    return { data, status: response.status };
  } catch (error) {
    return { data: null, status: 500 };
  }
}

export async function signUp({
  username,
  password
}: ISignUp): Promise<IResponseData> {
  try {
    const response = await fetch(`${baseUrl}/auth/sign-up`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });
    const data = await response.json();

    return { data, status: response.status };
  } catch (error) {
    return { data: null, status: 500 };
  }
}

export async function signOut(): Promise<IResponseData> {
  try {
    const response = await fetch(`${baseUrl}/auth/sign-out`, {
      credentials: 'include'
    });
    const data = await response.json();

    return { data, status: response.status };
  } catch (error) {
    return { data: null, status: 500 };
  }
}

export async function verify(): Promise<IResponseData> {
  try {
    const response = await fetch(`${baseUrl}/auth/verify`, {
      credentials: 'include'
    });
    const data = await response.json();
    const isVerified = response.status === HttpStatusCodes.OK;

    if (!isVerified) {
      return { data: null, status: response.status };
    }

    return { data, status: response.status };
  } catch (error) {
    return { data: null, status: 500 };
  }
}
