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
import axios, { AxiosRequestConfig } from "axios";
import "@alenaksu/json-viewer";

import { RestClientForm } from "../../components/RestClientForm";
import {
  IRestRequest,
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
    request() && mutate(null)
  });
  const [apiCallParams, setApiCallParams] = createSignal<AxiosRequestConfig>();
  const [response, {mutate}] = createResource(apiCallParams, () => {
    if (!apiCallParams()) {
      return null;
    }
    return axios.request(apiCallParams() as any).catch((err) => {
      if (!err.response.data) {
        err.response.data = {
          message: 'Can not process request'
        }
      }
      return err.response;
    });
  });
  const onFormSubmit = async (val: IRestRequest) => {
    const { body, url, method } = val.request;
    setApiCallParams({ body, url, method });
  };

  const onFormValUpdate = (val: IRestRequest) => {
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
    <div class="flex flex-col md:flex-row  gap-4 min-h-full bg-gray-200 p-4 border border-gray-300 rounded-lg">
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
        <Show when={!response.loading && response()}>
          <RestClientOutput response={response()} />
        </Show>
        <Show when={response.loading}>
          <div>Loading...</div>
        </Show>
      </div>
    </div>
  );
};

export default RestClient;