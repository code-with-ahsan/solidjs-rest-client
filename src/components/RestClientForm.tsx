import {
  withControl,
  createFormGroup,
  createFormControl,
  createFormArray,
  IFormGroup,
  ControlId,
  IFormControl,
} from "solid-forms";
import { createEffect, For } from "solid-js";
import { IRestRequest } from "../interfaces/rest.interfaces";
import IconButton from "./IconButton";
import { TextField } from "./TextField";

type HeaderFormGroup = IFormGroup<
  {
    key: IFormControl<string, Record<ControlId, any>>;
    value: IFormControl<string, Record<ControlId, any>>;
  },
  Record<ControlId, any>
>;

const createHeaderGroup = (key = "", value =""): HeaderFormGroup => {
  return createFormGroup({
    key: createFormControl(key),
    value: createFormControl(value),
  });
};

const controlFactory = () => {
  return createFormGroup({
    name: createFormControl<string>("New Request"),
    request: createFormGroup({
      method: createFormControl<string>("GET"),
      body: createFormControl<string>(""),
      url: createFormControl<string>(""),
      headers: createFormArray<HeaderFormGroup[]>(),
    }),
  });
};

export const RestClientForm = withControl<
  {
    request?: Partial<IRestRequest>;
    formSubmit: Function;
    formUpdate?: Function;
    actionBtnText: string;
  },
  typeof controlFactory
>({
  controlFactory,
  component: (props) => {
    const controlGroup = () => props.control.controls;
    const requestControlGroup = () => controlGroup().request.controls;
    const request = () => props.request;

    createEffect((requestId) => {
      if (!request || !request()) {
        return null;
      }
      if (request()?.id === requestId) {
        return requestId;
      }
      const req = request()?.request;
      controlGroup().name.setValue(request()?.name || "");
      requestControlGroup().body.setValue(req?.body || "");
      requestControlGroup().url.setValue(req?.url || "");
      requestControlGroup().method.setValue(req?.method || "");
      if (req?.headers?.length) {
        for (const header of req.headers) {
          // set timeout is required because the UI otherwise is not updated.
          setTimeout(() => {
            props.control.controls.request.controls.headers.push(
              createHeaderGroup(header.key, header.value)
            );
          }, 0);
        }
      } else {
        props.control.controls.request.controls.headers.push(
          createHeaderGroup()
        );
      }
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

    const headerValueUpdated = () => {
      props.formUpdate?.({
        ...props.control.value,
        request: {
          ...props.control.value.request,
          headers: [
            ...props.control.controls.request.controls.headers.controls.map((header) => {
              // For for some reason, the headers.value doesn't reflect the latest changes
              return {
                key: header.controls.key.value,
                value: header.controls.value.value
              }
            })
          ]
        }
      });
    }

    const addHeaderControlGroup = () => {
      requestControlGroup().headers.push(createHeaderGroup());
    };

    const removeHeaderControlGroup = (control: HeaderFormGroup) => {
      requestControlGroup().headers.removeControl(control)
    }

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
          const headersArr = props.control.controls.request.controls.headers;
          const headers = headersArr.controls.map((header) => {
            return {
              key: header.controls.key.value,
              value: header.controls.value.value,
            };
          }, {});
          const params = {
            ...props.control.value,
            request: {
              ...props.control.value.request,
              headers,
            },
          };
          props.formSubmit(params);
        }}
      >
        <div class="grid grid-cols-1 gap-4">
          <div>
            <label for="name" class="mb-4 block">
              Name
            </label>
            <TextField
              valueUpdated={() => {
                props.formUpdate?.(props.control.value);
              }}
              placeholder="name"
              id="name"
              label="Name"
              control={controlGroup().name}
            />
          </div>
          <div>
            <label for="url" class="mb-4 block">
              URL
            </label>
            <TextField
              valueUpdated={() => {
                props.formUpdate?.(props.control.value);
              }}
              placeholder="url"
              id="url"
              label="Url"
              control={requestControlGroup().url}
            />
          </div>

          <div class="flex justify-between items-center">
            <label class="my-4 block">Headers</label>
            <IconButton
              onClick={() => addHeaderControlGroup()}
              icon="add"
              label="Add Header"
            />
          </div>
          <div class="w-full flex flex-col items-end gap-4 divide-y divide-solid divide-purple-500">
            <For each={requestControlGroup().headers.controls}>
              {(_, acc) => {
                const controls = () =>
                  props.control.controls.request.controls.headers.controls[
                    acc()
                  ].controls;
                return (
                  <div class={`w-full flex flex-col gap-4 items-end ${acc() > 0 && 'pt-4'}`}>
                    <TextField
                      valueUpdated={headerValueUpdated}
                      id={`control_key_${acc()}`}
                      label="Header Key"
                      placeholder="header"
                      control={controls().key}
                    />
                    <TextField
                      valueUpdated={headerValueUpdated}
                      id={`control_value_${acc()}`}
                      label="Header Value"
                      placeholder="value"
                      control={controls().value}
                    />
                    {acc() > 0 && <IconButton onClick={() => {
                      removeHeaderControlGroup(_)
                      headerValueUpdated()
                    }} icon="trash" label="delete header" />}
                  </div>
                );
              }}
            </For>
          </div>

          <div>
            <label class="my-4 block">Method</label>
            <TextField
              valueUpdated={() => {
                props.formUpdate?.(props.control.value);
              }}
              id="method"
              label="Method"
              placeholder="method"
              control={requestControlGroup().method}
            />
          </div>
        </div>
        <div>
          <label class="my-4 block">Body</label>
          <TextField
            id="body"
            type="textarea"
            label="Body"
            placeholder="body"
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
