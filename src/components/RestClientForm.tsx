import { withControl, createFormGroup, createFormControl } from "solid-forms";
import { createEffect, Resource } from "solid-js";
import { IRestRequest } from "../interfaces/rest.interfaces";
import { TextField } from "./TextField";

const controlFactory = () => {
  return createFormGroup({
    name: createFormControl<string>("New Request"),
    request: createFormGroup({
      method: createFormControl<string>("GET"),
      body: createFormControl<string>(""),
      url: createFormControl<string>("")
    })
  });
};

export const RestClientForm = withControl<
  {
    request?: Partial<IRestRequest>;
    formSubmit: Function;
    formUpdate?: Function;
    actionBtnText: string
  },
  typeof controlFactory
>({
  controlFactory,
  component: (props) => {
    const controlGroup = () => props.control.controls;
    const requestControlGroup = () => controlGroup().request.controls;
    const request = () => props.request

    createEffect((requestId) => {
      if (!request || !request()) {
        return null;
      }
      if (request()?.id === requestId) {
        return requestId;
      }
      const value = request()?.request;
      controlGroup().name.setValue(request()?.name || "");
      requestControlGroup().body.setValue(value?.body || "");
      requestControlGroup().url.setValue(value?.url || "");
      requestControlGroup().method.setValue(value?.method || "");
      return request()?.id;
    });

    const bodyValueUpdated = (value: any) => {
      try {
        if (!value) {
          requestControlGroup().body.setErrors(null);
          return;
        }
        const pretty = JSON.stringify(JSON.parse(value), undefined, 4);
        requestControlGroup().body.setValue(pretty);
        requestControlGroup().body.setErrors(null);
      } catch (e) {
        requestControlGroup().body.setErrors({
          invalidJson: true,
        });
      } finally {
        props.formUpdate?.(props.control.value);
      }
    };

    const formControlUpdateed = () => {
      // props.formUpdate;
    };

    return (
      <form
        action=""
        class="space-y-4"
        classList={{
          "is-valid": props.control.isValid,
          "is-invalid": !props.control.isValid,
          "is-touched": props.control.isTouched,
          "is-untouched": !props.control.isTouched,
          "is-dirty": props.control.isDirty,
          "is-clean": !props.control.isDirty,
        }}
        onSubmit={(e) => {
          e.preventDefault();
          props.formSubmit(props.control.value);
        }}
      >
        <div class="grid grid-cols-1 gap-4">
          <div>
            <label class="sr-only" for="email">
              Name
            </label>
            <TextField
              valueUpdated={() => {
                props.formUpdate?.(props.control.value);
              }}
              placeholder='name'
              id="name"
              label="Name"
              control={controlGroup().name}
            />
          </div>
          <div>
            <label class="sr-only" for="email">
              Email
            </label>
            <TextField
              valueUpdated={() => {
                props.formUpdate?.(props.control.value);
              }}
              placeholder='url'
              id="url"
              label="Url"
              control={requestControlGroup().url}
            />
          </div>

          <div>
            <TextField
              valueUpdated={() => {
                props.formUpdate?.(props.control.value);
              }}
              id="method"
              label="Method"
              placeholder='method'
              control={requestControlGroup().method}
            />
          </div>
        </div>
        <div>
          <TextField
            id="body"
            type="textarea"
            label="Body"
            placeholder='body'
            control={requestControlGroup().body}
            valueUpdated={bodyValueUpdated}
          />
        </div>

        <div class="mt-4">
          <button
            disabled={!props.control.isValid}
            type="submit"
            class="inline-flex items-center disabled:bg-gray-500 justify-center w-full px-5 py-3 text-white bg-purple-600 hover:bg-purple-700 rounded-lg sm:w-auto"
          >
            <span class="font-medium"> {props.actionBtnText} </span>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-5 h-5 ml-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </button>
        </div>
      </form>
    );
  },
});
