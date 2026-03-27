import { toast } from "react-toastify";
import { GET, POST } from "./client";
import { ApiEndpoints } from "./api-endpoints";
import { Relationship } from "../types";
import { TypesOfRelationships } from "../types";

export interface AddRelationshipPayload {
  relatedUserId: number;
  type: TypesOfRelationships;
}

export const getRelationshipsAPI = async (): Promise<Relationship[] | null> => {
  try {
    const response = await GET(ApiEndpoints.RELATIONSHIPS);
    if (response.ok) {
      return response.data ?? [];
    }

    toast.error(response.error ?? "Failed to load relationships");

    return null;
  } catch (error) {
    toast.error(`Error: ${Error}`);
    return null;
  }
};

export const addRelationshipsAPI = async (
  newRelationshipsData: AddRelationshipPayload
): Promise<Relationship[] | null> => {
  try {
    const response = await POST(
      ApiEndpoints.RELATIONSHIPS,
      newRelationshipsData
    );
    if (response.ok) {
      toast.success("New relationship added");
      return response.data;
    }

    toast.error(response.error ?? "Failed to add relationships");

    return null;
  } catch (error) {
    toast.error(`Error: ${Error}`);

    return null;
  }
};
