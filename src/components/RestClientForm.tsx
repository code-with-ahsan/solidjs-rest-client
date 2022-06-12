import { withControl, createFormGroup, createFormControl } from "solid-forms";
import { createEffect, Resource } from "solid-js";
import { IRestRequest } from "../interfaces/rest.interfaces";
import { TextField } from "./TextField";

const controlFactory = () => {
  return createFormGroup({
    url: createFormControl<string>(""),
    method: createFormControl<string>(""),
    body: createFormControl<string>(""),
  });
};

export const RestClientForm = withControl<
  {
    request: Resource<IRestRequest>;
    formSubmit: Function;
    formUpdate: Function;
  },
  typeof controlFactory
>({
  controlFactory,
  component: ({ control, request, formSubmit, formUpdate }) => {
    const controls = () => control.controls;

    createEffect((requestId) => {
      if (request().id === requestId) {
        return requestId;
      }
      const { url, method, body } = request().request;
      controls().body.setValue(body || "");
      controls().url.setValue(url || "");
      controls().method.setValue(method || "");
      return request().id;
    });

    const bodyValueUpdated = (value: any) => {
      try {
        if (!value) {
          controls().body.setErrors(null);
          return;
        }
        const pretty = JSON.stringify(JSON.parse(value), undefined, 4);
        controls().body.setValue(pretty);
        controls().body.setErrors(null);
      } catch (e) {
        controls().body.setErrors({
          invalidJson: true,
        });
      } finally {
        formUpdate(control.value);
      }
    };

    const formControlUpdateed = () => {
      formUpdate;
    };

    return (
      <form
        action=""
        class="space-y-4"
        classList={{
          "is-valid": control.isValid,
          "is-invalid": !control.isValid,
          "is-touched": control.isTouched,
          "is-untouched": !control.isTouched,
          "is-dirty": control.isDirty,
          "is-clean": !control.isDirty,
        }}
        onSubmit={(e) => {
          e.preventDefault();
          formSubmit(control.value);
        }}
      >
        <label>{request().name}</label>
        <div class="grid grid-cols-1 gap-4">
          <div>
            <label class="sr-only" for="email">
              Email
            </label>
            <TextField
              valueUpdated={() => {
                formUpdate(control.value);
              }}
              id="url"
              label="Url"
              control={controls().url}
            />
          </div>

          <div>
            <TextField
              valueUpdated={() => {
                formUpdate(control.value);
              }}
              id="method"
              label="Method"
              control={controls().method}
            />
          </div>
        </div>
        <div>
          <TextField
            id="body"
            type="textarea"
            label="Body"
            control={controls().body}
            valueUpdated={bodyValueUpdated}
          />
        </div>

        <div class="mt-4">
          <button
            disabled={!control.isValid}
            type="submit"
            class="inline-flex items-center disabled:bg-gray-500 justify-center w-full px-5 py-3 text-white bg-smooth-gray rounded-lg sm:w-auto"
          >
            <span class="font-medium"> Send </span>

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
