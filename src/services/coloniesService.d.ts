import Colony from "../types/Colony";

declare module './coloniesService' {
  export function saveColoniesToServer(colonies: number[]): Promise<void>;
  export function saveColonyReport(report: any): Boolean;
  export function getColoniesFromServer(): Promise<[]>;
  // Type for the result of getColoniesFromServer function
  declare type GetColoniesResult = Promise<Colony[] | null>;

  // Function to get colonies from the server
  declare const getColoniesFromServer: () => GetColoniesResult;

  // Export the types and functions
  export {
    saveColoniesToServer, saveColonyReport, getColoniesFromServer
  }
}