import { APIResult, get, handleAPIError } from "./requests";

export type User = {
  _id: string;
  name: string;
  profilePictureUrl?: string;
};

export async function getUser(id: string): Promise<APIResult<User>> {
  try {
    const response = await get(`/api/task/${id}`);
    const json = (await response.json()) as User;
    return { success: true, data: json };
  } catch (error) {
    return handleAPIError(error);
  }
}
