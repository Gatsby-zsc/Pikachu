// For nested form
// https://github.com/react-hook-form/react-hook-form/issues/1005

export function stopPropagate(callback: () => void) {
  return (e: { stopPropagation: () => void; preventDefault: () => void }) => {
    e.preventDefault();
    e.stopPropagation();
    callback();
  };
}
