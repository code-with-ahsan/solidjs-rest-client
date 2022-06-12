import { RouteDataFuncArgs, useRouteData } from 'solid-app-router';
import { Component, createResource, Resource } from 'solid-js';
import axios from 'axios';


import { restRequests } from '../../App';
import { RestClientForm } from '../../components/RestClientForm';
import { IRequest, IRestRequest } from '../../interfaces/rest.interfaces';


/**
 * Data function
 * @param id request id
 */
export const fetchSelectedRequest = ({params}: RouteDataFuncArgs) => {
  const [request] = createResource(() => params.id, () => Promise.resolve(restRequests().find(r => r.id === params.id)));
  return request;
}

const RestClient: Component = () => {
  const request: Resource<IRestRequest> = useRouteData();
  const onFormSubmit = async ({method, url, body}: IRequest) => {
    const resp = await axios({
      method,
      url,
      data: body
    })
    console.log({resp})
  }
  
  return (
    <div class='flex gap-4 bg-gray-200 p-4 border border-gray-300 min-h-[80vh]'>
      <div class='flex-1'>
        <RestClientForm request={request} formSubmit={onFormSubmit}/>
      </div>
      <div class='flex-1'>

      </div>
    </div>
  )
}

export default RestClient;