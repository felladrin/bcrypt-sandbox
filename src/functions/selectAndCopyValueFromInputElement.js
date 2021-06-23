export function selectAndCopyValueFromInputElement(inputElement) {
  inputElement.select();
  inputElement.setSelectionRange?.(0, inputElement.value.length);
  document.execCommand("copy");
}
