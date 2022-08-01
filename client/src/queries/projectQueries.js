import { gql } from "@apollo/client"

export const GET_PROJECTS = gql`
  query GetProjects {
    projects {
      id
      name
      status
    }
  }
`;

export const GET_PROJECT = gql`
  query GetProject($id: ID!) {
    project(id: $id) {
      id
      name
      status
      client {
        id
        name
        email
        phone
      }
    }
  }`