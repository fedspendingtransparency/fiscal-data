// if (typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope) {
//   self.global = self;
//   self.window = self;
// }

// import RefreshRuntime from '/@react-refresh';
if (import.meta.hot) {
  // RefreshRuntime.injectIntoGlobalHook(window);
  window.$RefreshReg$ = () => {};
  window.$RefreshSig$ = () => type => type;
  // window.__vite_plugin_react_preamble_installed__ = true;
}
