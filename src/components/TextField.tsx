import { IFormControl, createFormControl } from 'solid-forms';
import { Component } from 'solid-js';

export const TextField: Component<{
  control: IFormControl<string>,
  label: string,
  placeholder?: string,
}> = (props) => {
  return (
    <label>
      <span class='input-label'>{props.label}</span>

      <input
        type="text"
        value={props.control.value}
        oninput={(e) => {
          props.control.markDirty(true);
          props.control.setValue(e.currentTarget.value);
        }}
        onblur={() => props.control.markTouched(true)}
        placeholder={props.placeholder}
      />
    </label>
  );
};