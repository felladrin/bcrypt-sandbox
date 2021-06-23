export function selectAndCopyValueFromInputElement(inputElement: HTMLInputElement) {
  inputElement.select();
  inputElement.setSelectionRange?.(0, inputElement.value.length);
  document.execCommand("copy");
}
