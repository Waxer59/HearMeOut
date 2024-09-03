import { getEnvVariables } from '@helpers/getEnvVariables';
import type { SettingsDetails } from '@store/types/types';
import {
  type UpdateAccount,
  type RequireAtLeastOne,
  HttpMethods,
  HttpStatusCodes,
  type VerifyResponse,
  type CreateAccount,
  type SignInDetails,
  type IResponseData
} from '@/types/types';

const baseUrl = `${getEnvVariables().VITE_HEARMEOUT_API}/api`;

export async function signIn(
  signInDetails: SignInDetails
): Promise<IResponseData> {
  try {
    const response = await fetch(`${baseUrl}/auth/sign-in`, {
      method: HttpMethods.POST,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(signInDetails)
    });
    const data = await response.json();

    return { data, status: response.status };
  } catch (error) {
    return { data: null, status: HttpStatusCodes.INTERNAL_SERVER_ERROR };
  }
}

export async function signUp(
  createAccount: CreateAccount
): Promise<IResponseData> {
  try {
    const response = await fetch(`${baseUrl}/auth/sign-up`, {
      method: HttpMethods.POST,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(createAccount)
    });
    const data = await response.json();

    return { data, status: response.status };
  } catch (error) {
    return { data: null, status: HttpStatusCodes.INTERNAL_SERVER_ERROR };
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
    return { data: null, status: HttpStatusCodes.INTERNAL_SERVER_ERROR };
  }
}

export async function verify(): Promise<IResponseData> {
  try {
    const response = await fetch(`${baseUrl}/auth/verify`, {
      credentials: 'include'
    });
    const data: VerifyResponse = await response.json();
    const isVerified = response.status === HttpStatusCodes.OK;

    if (!isVerified) {
      return { data: null, status: response.status };
    }

    return { data, status: response.status };
  } catch (error) {
    return { data: null, status: HttpStatusCodes.INTERNAL_SERVER_ERROR };
  }
}

export async function searchUser(name: string): Promise<IResponseData> {
  try {
    const response = await fetch(`${baseUrl}/users/search-username/${name}`, {
      credentials: 'include'
    });
    const data = await response.json();

    return { data, status: response.status };
  } catch (error) {
    return { data: null, status: HttpStatusCodes.INTERNAL_SERVER_ERROR };
  }
}

export async function getFriendRequests(): Promise<IResponseData> {
  try {
    const response = await fetch(`${baseUrl}/friend-requests`, {
      credentials: 'include'
    });
    const data = await response.json();

    return { data, status: response.status };
  } catch (error) {
    return { data: null, status: HttpStatusCodes.INTERNAL_SERVER_ERROR };
  }
}

export async function addActiveConversation(
  id: string
): Promise<IResponseData> {
  try {
    const response = await fetch(
      `${baseUrl}/users/active-conversations/${id}`,
      {
        credentials: 'include',
        method: HttpMethods.PATCH
      }
    );
    const data = await response.json();

    return { data, status: response.status };
  } catch (error) {
    return { data: null, status: HttpStatusCodes.INTERNAL_SERVER_ERROR };
  }
}

export async function removeActiveConversation(
  id: string
): Promise<IResponseData> {
  try {
    const response = await fetch(
      `${baseUrl}/users/active-conversations/${id}`,
      {
        credentials: 'include',
        method: HttpMethods.DELETE
      }
    );
    const data = await response.json();

    return { data, status: response.status };
  } catch (error) {
    return { data: null, status: HttpStatusCodes.INTERNAL_SERVER_ERROR };
  }
}

export async function getAllConversationMessages(
  id: string
): Promise<IResponseData> {
  try {
    const response = await fetch(`${baseUrl}/messages/${id}`, {
      credentials: 'include'
    });
    const data = await response.json();

    return { data, status: response.status };
  } catch (error) {
    return { data: null, status: HttpStatusCodes.INTERNAL_SERVER_ERROR };
  }
}

export async function updateUserAccount(
  updateAccount: RequireAtLeastOne<UpdateAccount>
): Promise<IResponseData> {
  try {
    const response = await fetch(`${baseUrl}/users`, {
      method: HttpMethods.PATCH,
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(updateAccount)
    });
    const data = await response.json();

    return { data, status: response.status };
  } catch (error) {
    return { data: null, status: HttpStatusCodes.INTERNAL_SERVER_ERROR };
  }
}

export async function deleteUserAccount(): Promise<IResponseData> {
  try {
    const response = await fetch(`${baseUrl}/users`, {
      method: HttpMethods.DELETE,
      credentials: 'include'
    });
    const data = await response.json();

    return { data, status: response.status };
  } catch (error) {
    return { data: null, status: HttpStatusCodes.INTERNAL_SERVER_ERROR };
  }
}

export async function updateUserSettings(
  settings: SettingsDetails
): Promise<IResponseData> {
  try {
    const response = await fetch(`${baseUrl}/configurations`, {
      method: HttpMethods.PATCH,
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(settings)
    });
    const data = await response.json();

    return { data, status: response.status };
  } catch (error) {
    return { data: null, status: HttpStatusCodes.INTERNAL_SERVER_ERROR };
  }
}

export async function updateUserAvatar(avatar: File): Promise<IResponseData> {
  try {
    const formData = new FormData();
    formData.append('avatar', avatar);

    const response = await fetch(`${baseUrl}/users`, {
      method: HttpMethods.PATCH,
      credentials: 'include',
      body: formData
    });
    const data = await response.json();

    return { data, status: response.status };
  } catch (error) {
    return { data: null, status: HttpStatusCodes.INTERNAL_SERVER_ERROR };
  }
}
