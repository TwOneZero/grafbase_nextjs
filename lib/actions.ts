import { ProjectForm } from "@/common.types";
import {
  createProjectMutation,
  createUserMutation,
  deleteProjectMutation,
  getProjectByIdQuery,
  getProjectsOfUserQuery,
  getUserQuery,
  projectsQuery,
} from "@/graphql";
import { GraphQLClient } from "graphql-request";
const isProduction = process.env.NODE_ENV === "production";

const apiUrl = isProduction
  ? process.env.NEXT_PUBLIC_GRAFBASE_URL || ""
  : "http://127.0.0.1:4000/graphql";

const apiKey = isProduction
  ? process.env.NEXT_PUBLIC_GRAFBASE_KEY || ""
  : "letmein";

const serverUrl = isProduction
  ? process.env.NEXT_PUBLIC_SERVER_URL
  : "http://localhost:3000";

const client = new GraphQLClient(apiUrl);

const makeGraphQLRequest = async (query: string, variables = {}) => {
  try {
    //client.request...
    return await client.request(query, variables);
  } catch (error) {
    throw error;
  }
};

export const getUser = (email: string) => {
  client.setHeader("x-api-key", apiKey);
  return makeGraphQLRequest(getUserQuery, { email });
};

export const createUser = (name: string, email: string, avatarUrl: string) => {
  client.setHeader("x-api-key", apiKey);
  const variables = { input: { name, email, avatarUrl } };

  return makeGraphQLRequest(createUserMutation, variables);
};

export const fetchToken = async () => {
  try {
    //nextauth provides GET token api
    const response = await fetch(`${serverUrl}/api/auth/token`);
    return response.json();
  } catch (error) {
    throw error;
  }
};

export const uploadImage = async (imagePath: string) => {
  try {
    const response = await fetch(`${serverUrl}/api/upload`, {
      method: "POST",
      body: JSON.stringify({ path: imagePath }),
    });
    return response.json();
  } catch (error) {
    throw error;
  }
};

export const createNewProject = async (
  form: ProjectForm,
  creatorId: string,
  token: string
) => {
  //이미지 업로드를 위해서는 permission 필요! -> Authrization 헤더에 베어러토큰 추가
  client.setHeader("Authorization", `Bearer ${token}`);
  client.setHeader("x-api-key", apiKey);

  const imageUrl = await uploadImage(form.image);
  if (imageUrl.url) {
    const variables = {
      input: {
        ...form,
        image: imageUrl.url,
        createdBy: {
          link: creatorId,
        },
      },
    };
    return makeGraphQLRequest(createProjectMutation, variables);
  }
};

export const fetchAllProjects = async (
  category?: string,
  endCursor?: string
) => {
  client.setHeader("x-api-key", apiKey);
  return makeGraphQLRequest(projectsQuery, { category, endCursor });
};

export const getProjectDetails = async (id: string) => {
  client.setHeader("x-api-key", apiKey);
  return makeGraphQLRequest(getProjectByIdQuery, { id });
};

export const getUserProjects = async (id: string, last?: number) => {
  client.setHeader("x-api-key", apiKey);
  return makeGraphQLRequest(getProjectsOfUserQuery, { id, last });
};

export const deleteProject = (id: string, token: string) => {
  client.setHeader("Authorization", `Bearer ${token}`);
  return makeGraphQLRequest(deleteProjectMutation, { id });
};
