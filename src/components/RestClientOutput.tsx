import { Component, ComponentProps, For } from "solid-js";
import { IRestResponse } from "../interfaces/rest.interfaces";

interface RestClientOutputProps extends ComponentProps<any> {
  response: IRestResponse | null;
}

const RestClientOutput: Component<RestClientOutputProps> = (
  props: RestClientOutputProps
) => {
  return (
    <div>
      <div
        class="status px-4 py-2 rounded-lg"
        classList={{
          "bg-green-200 text-green-900 border border-green-900":
            props.response?.status === 200,
          "bg-red-200 text-red-900 border border-red-900":
            props.response?.status !== 200,
        }}
      >
        {props.response && props.response.status}
      </div>
      <div class="rounded-lg my-4 bg-white px-4 py-2 divide-y">
        <For each={Object.keys(props.response?.headers)}>
          {(key: string) => {
            const value = props.response?.headers[key];
            return (
              <div class="header flex py-1 justify-between">
                <span>{key}:</span> <span>{value}</span>
              </div>
            );
          }}
        </For>
      </div>
      <json-viewer class="p-4" data={props.response?.data}>{props.response?.data}</json-viewer>
    </div>
  );
};

export default RestClientOutput;
