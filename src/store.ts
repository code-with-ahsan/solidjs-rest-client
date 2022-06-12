import { IRestRequest } from "./interfaces/rest.interfaces";
import { createStorageSignal } from "@solid-primitives/storage";

export const [restRequests, setRestRequests] = createStorageSignal<
  IRestRequest[]
>(
  "requests",
  [
    {
      id: "1",
      name: "Get Scores",
      description: "Getting scores from server",
      request: {
        method: "GET",
        url: "https://scorer-pro-backend.herokuapp.com/score/game123",
      },
    },
    {
      id: "2",
      name: "Add Score",
      description: "Adding scores to server",
      request: {
        method: "POST",
        url: "https://scorer-pro-backend.herokuapp.com/score",
      },
    },
  ],
  {
    deserializer: (val): IRestRequest[] => {
      if (val === null) {
        return [];
      }
      return JSON.parse(val);
    },
    serializer: (val) => {
      return JSON.stringify(val);
    },
  }
);
