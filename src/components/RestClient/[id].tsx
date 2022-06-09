import { useRouteData } from 'solid-app-router';
import { Component, createResource } from 'solid-js';
import { withControl, createFormGroup, createFormControl } from 'solid-forms';

import { restRequests } from '../../App';
import { IRestRequest } from '../../interfaces/rest.interfaces';
import { TextField } from '../TextField';


/**
 * Data function
 * @param id request id
 */
export const fetchSelectedRequest = (id: string) => {
  const [request] = createResource(() => id, () => Promise.resolve(restRequests().find(r => r.id === id)));
  return request;
}

const controlFactory = () => {
  return createFormGroup({
    url: createFormControl<string>(''),
    method: createFormControl<string>(''),
    body: createFormControl<string>('')
  })
}

const RestClientForm = withControl({
  controlFactory,
  component: (props) => {
    const controls = () => props.control.controls;

    return <fieldset classList={{
      "is-valid": props.control.isValid,
      "is-invalid": !props.control.isValid,
      "is-touched": props.control.isTouched,
      "is-untouched": !props.control.isTouched,
      "is-dirty": props.control.isDirty,
      "is-clean": !props.control.isDirty,
    }}>
      <TextField label="Url" control={controls().url} />
      <TextField label="Method" control={controls().method} />
      <TextField label="Body" control={controls().body} />
    </fieldset>
  }
})

const RestClient: Component = () => {
  const request: IRestRequest = useRouteData();
  
  return (
    <div>
      <h2>RestClient</h2>
      <pre>{JSON.stringify(request)}</pre>
      <RestClientForm />
    </div>
  )
}

export default RestClient;