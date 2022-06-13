import { RouteDataFuncArgs, useRouteData } from 'solid-app-router';
import {
  Component,
  createEffect,
  createResource,
  createSignal,
  Match,
  Resource,
  Show,
  Suspense,
  Switch,
} from "solid-js";
import axios from "axios";
import "@alenaksu/json-viewer";

import { RestClientForm } from "../../components/RestClientForm";
import {
  IRequest,
  IRestRequest,
  IRestResponse,
} from "../../interfaces/rest.interfaces";
import RestClientOutput from "../../components/RestClientOutput";
import { restRequests, setRestRequests } from "../../store";

/**
 * Data function
 * @param id request id
 */
export const fetchSelectedRequest = ({ params }: RouteDataFuncArgs) => {
  const [request] = createResource(
    () => params.id,
    () => Promise.resolve(restRequests()?.find((r) => r.id === params.id))
  );
  return request;
};

const RestClient: Component = () => {
  const request: Resource<IRestRequest> = useRouteData();
  createEffect(() => {
    console.log("request", request());
  });
  const [response, setResponse] = createSignal<IRestResponse | null>(null);
  const onFormSubmit = async (val: IRestRequest) => {
    const { body, url, method } = val.request;
    try {
      const resp = await axios.request({
        method,
        url,
        data: body ? JSON.parse(body) : null,
      });
      setResponse(resp);
    } catch (e: any) {
      setResponse(e.response);
    }
  };

  const onFormValUpdate = (val: IRestRequest) => {
    console.log("onFormValUpdate", val);
    setRestRequests((requestsPrev) => {
      if (!requestsPrev) {
        return [
          {
            ...request(),
            ...val,
          },
        ];
      }
      const req = requestsPrev.find((r) => r.id === request().id);
      if (!req) {
        return requestsPrev;
      }
      return requestsPrev.map((r) => {
        if (r.id === request().id) {
          return {
            ...r,
            request: {
              ...r.request,
              ...val.request,
            },
            name: val.name || r.name
          };
        }
        return r;
      });
    });
  };

  return (
    <div class="flex gap-4 bg-gray-200 p-4 border border-gray-300 min-h-[80vh]">
      <div class="flex-1">
        <Suspense fallback={<div>Loading...</div>}>
          <Switch>
            <Match when={request.loading}>
              <div>Loading...</div>
            </Match>
            <Match when={request()}>
              <RestClientForm
                request={request()}
                formUpdate={onFormValUpdate}
                formSubmit={onFormSubmit}
                actionBtnText={'Send'}
              />
            </Match>
          </Switch>
        </Suspense>
      </div>
      <div class="flex-1">
        <Show when={response()}>
          <RestClientOutput response={response()} />
        </Show>
      </div>
    </div>
  );
};

export default RestClient;