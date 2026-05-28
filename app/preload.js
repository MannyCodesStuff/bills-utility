(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(global, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "electron":
/*!***************************!*\
  !*** external "electron" ***!
  \***************************/
/***/ ((module) => {

module.exports = require("electron");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
/*!*************************!*\
  !*** ./main/preload.ts ***!
  \*************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! electron */ "electron");
/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(electron__WEBPACK_IMPORTED_MODULE_0__);

const handler = {
  send(channel, value) {
    electron__WEBPACK_IMPORTED_MODULE_0__.ipcRenderer.send(channel, value);
  },
  on(channel, callback) {
    const subscription = (_event, ...args) => callback(...args);
    electron__WEBPACK_IMPORTED_MODULE_0__.ipcRenderer.on(channel, subscription);
    return () => {
      electron__WEBPACK_IMPORTED_MODULE_0__.ipcRenderer.removeListener(channel, subscription);
    };
  },
  async selectDirectory() {
    return electron__WEBPACK_IMPORTED_MODULE_0__.ipcRenderer.invoke('select-directory');
  },
  async getServerStatus() {
    return electron__WEBPACK_IMPORTED_MODULE_0__.ipcRenderer.invoke('get-server-status');
  },
  async getDefaultDirectory() {
    return electron__WEBPACK_IMPORTED_MODULE_0__.ipcRenderer.invoke('get-default-directory');
  },
  async setDefaultDirectory(directory) {
    return electron__WEBPACK_IMPORTED_MODULE_0__.ipcRenderer.invoke('set-default-directory', directory);
  },
  async getServerPort() {
    return electron__WEBPACK_IMPORTED_MODULE_0__.ipcRenderer.invoke('get-server-port');
  },
  async getVendors() {
    return electron__WEBPACK_IMPORTED_MODULE_0__.ipcRenderer.invoke('get-vendors');
  },
  async getASNs(storeId, vendorId, date) {
    return electron__WEBPACK_IMPORTED_MODULE_0__.ipcRenderer.invoke('get-asn-by-vendor', storeId, vendorId, date);
  },
  async getPdfFiles(directoryPath) {
    return electron__WEBPACK_IMPORTED_MODULE_0__.ipcRenderer.invoke('get-pdf-files', directoryPath);
  },
  async readPdfFile(filePath) {
    return electron__WEBPACK_IMPORTED_MODULE_0__.ipcRenderer.invoke('read-pdf-file', filePath);
  },
  async getExistingDirectory(storeId, type, date) {
    return electron__WEBPACK_IMPORTED_MODULE_0__.ipcRenderer.invoke('get-existing-directory', storeId, type, date);
  },
  async getExistingDirectories(storeId, date) {
    return electron__WEBPACK_IMPORTED_MODULE_0__.ipcRenderer.invoke('get-existing-directories', storeId, date);
  },
  onServerStatusChange(callback) {
    const subscription = (_event, status) => callback(status);
    electron__WEBPACK_IMPORTED_MODULE_0__.ipcRenderer.on('server-status', subscription);
    return () => {
      electron__WEBPACK_IMPORTED_MODULE_0__.ipcRenderer.removeListener('server-status', subscription);
    };
  },
  // Update-related APIs
  async checkForUpdates() {
    return electron__WEBPACK_IMPORTED_MODULE_0__.ipcRenderer.invoke('check-for-updates');
  },
  async downloadUpdate() {
    return electron__WEBPACK_IMPORTED_MODULE_0__.ipcRenderer.invoke('download-update');
  },
  async installUpdate() {
    return electron__WEBPACK_IMPORTED_MODULE_0__.ipcRenderer.invoke('install-update');
  },
  async getAppVersion() {
    return electron__WEBPACK_IMPORTED_MODULE_0__.ipcRenderer.invoke('get-app-version');
  },
  onUpdateStatus(callback) {
    const subscription = (_event, status) => callback(status);
    electron__WEBPACK_IMPORTED_MODULE_0__.ipcRenderer.on('update-status', subscription);
    return () => {
      electron__WEBPACK_IMPORTED_MODULE_0__.ipcRenderer.removeListener('update-status', subscription);
    };
  },
  async renameDocument(data) {
    return electron__WEBPACK_IMPORTED_MODULE_0__.ipcRenderer.invoke('rename-document', data);
  },
  async deleteFile(filePath) {
    return electron__WEBPACK_IMPORTED_MODULE_0__.ipcRenderer.invoke('delete-file', filePath);
  },
  async moveFileToZDrive(data) {
    return electron__WEBPACK_IMPORTED_MODULE_0__.ipcRenderer.invoke('move-file-to-zdrive', data);
  },
  async uploadPdf(data) {
    return electron__WEBPACK_IMPORTED_MODULE_0__.ipcRenderer.invoke('upload-pdf', data);
  },
  // Certificate-related APIs
  async checkCertificateInstalled() {
    return electron__WEBPACK_IMPORTED_MODULE_0__.ipcRenderer.invoke('check-certificate-installed');
  },
  async installCertificate() {
    return electron__WEBPACK_IMPORTED_MODULE_0__.ipcRenderer.invoke('install-certificate');
  }
  // onLogMessage(callback: (message: string) => void) {
  //   const subscription = (_event: IpcRendererEvent, message: string) =>
  //     callback(message)
  //   ipcRenderer.on('log-message', subscription)

  //   return () => {
  //     ipcRenderer.removeListener('log-message', subscription)
  //   }
  // }
};
electron__WEBPACK_IMPORTED_MODULE_0__.contextBridge.exposeInMainWorld('ipc', handler);
/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUUsQ0FBQyxlQUFlLEVBQUVFLFlBQVksQ0FBQztJQUU3QyxPQUFPLE1BQU07TUFDWFAsaURBQVcsQ0FBQ1UsY0FBYyxDQUFDLGVBQWUsRUFBRUgsWUFBWSxDQUFDO0lBQzNELENBQUM7RUFDSCxDQUFDO0VBQ0QsTUFBTThCLGNBQWNBLENBQUNDLElBT3BCLEVBQUU7SUFDRCxPQUFPdEMsaURBQVcsQ0FBQ1ksTUFBTSxDQUFDLGlCQUFpQixFQUFFMEIsSUFBSSxDQUFDO0VBQ3BELENBQUM7RUFDRCxNQUFNQyxVQUFVQSxDQUFDYixRQUFnQixFQUFFO0lBQ2pDLE9BQU8xQixpREFBVyxDQUFDWSxNQUFNLENBQUMsYUFBYSxFQUFFYyxRQUFRLENBQUM7RUFDcEQsQ0FBQztFQUNELE1BQU1jLGdCQUFnQkEsQ0FBQ0YsSUFJdEIsRUFBRTtJQUNELE9BQU90QyxpREFBVyxDQUFDWSxNQUFNLENBQUMscUJBQXFCLEVBQUUwQixJQUFJLENBQUM7RUFDeEQsQ0FBQztFQUNELE1BQU1HLFNBQVNBLENBQUNILElBUWYsRUFBRTtJQUNELE9BQU90QyxpREFBVyxDQUFDWSxNQUFNLENBQUMsWUFBWSxFQUFFMEIsSUFBSSxDQUFDO0VBQy9DLENBQUM7RUFDRDtFQUNBLE1BQU1JLHlCQUF5QkEsQ0FBQSxFQUFHO0lBQ2hDLE9BQU8xQyxpREFBVyxDQUFDWSxNQUFNLENBQUMsNkJBQTZCLENBQUM7RUFDMUQsQ0FBQztFQUNELE1BQU0rQixrQkFBa0JBLENBQUEsRUFBRztJQUN6QixPQUFPM0MsaURBQVcsQ0FBQ1ksTUFBTSxDQUFDLHFCQUFxQixDQUFDO0VBQ2xEO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7O0VBRUE7RUFDQTtFQUNBO0VBQ0E7QUFDRixDQUFDO0FBRURiLG1EQUFhLENBQUM2QyxpQkFBaUIsQ0FBQyxLQUFLLEVBQUUzQyxPQUFPLENBQUMsQyIsInNvdXJjZXMiOlsid2VicGFjazovL2JpbGxzLXV0aWxpdHkvd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovL2JpbGxzLXV0aWxpdHkvZXh0ZXJuYWwgbm9kZS1jb21tb25qcyBcImVsZWN0cm9uXCIiLCJ3ZWJwYWNrOi8vYmlsbHMtdXRpbGl0eS93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9iaWxscy11dGlsaXR5L3dlYnBhY2svcnVudGltZS9jb21wYXQgZ2V0IGRlZmF1bHQgZXhwb3J0Iiwid2VicGFjazovL2JpbGxzLXV0aWxpdHkvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2JpbGxzLXV0aWxpdHkvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9iaWxscy11dGlsaXR5L3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vYmlsbHMtdXRpbGl0eS8uL21haW4vcHJlbG9hZC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShbXSwgZmFjdG9yeSk7XG5cdGVsc2Uge1xuXHRcdHZhciBhID0gZmFjdG9yeSgpO1xuXHRcdGZvcih2YXIgaSBpbiBhKSAodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnID8gZXhwb3J0cyA6IHJvb3QpW2ldID0gYVtpXTtcblx0fVxufSkoZ2xvYmFsLCAoKSA9PiB7XG5yZXR1cm4gIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiZWxlY3Ryb25cIik7IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSAobW9kdWxlKSA9PiB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdCgpID0+IChtb2R1bGVbJ2RlZmF1bHQnXSkgOlxuXHRcdCgpID0+IChtb2R1bGUpO1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCB7IFRhYlR5cGUgfSBmcm9tICdAL2NvbXBvbmVudHMvYmlsbC1tYW5hZ2VyJ1xyXG5pbXBvcnQgeyBTdG9yZUlkIH0gZnJvbSAnQC9ob29rcy91c2Utc3RvcmUnXHJcbmltcG9ydCB7IGNvbnRleHRCcmlkZ2UsIGlwY1JlbmRlcmVyLCBJcGNSZW5kZXJlckV2ZW50IH0gZnJvbSAnZWxlY3Ryb24nXHJcblxyXG5jb25zdCBoYW5kbGVyID0ge1xyXG4gIHNlbmQoY2hhbm5lbDogc3RyaW5nLCB2YWx1ZTogdW5rbm93bikge1xyXG4gICAgaXBjUmVuZGVyZXIuc2VuZChjaGFubmVsLCB2YWx1ZSlcclxuICB9LFxyXG4gIG9uKGNoYW5uZWw6IHN0cmluZywgY2FsbGJhY2s6ICguLi5hcmdzOiB1bmtub3duW10pID0+IHZvaWQpIHtcclxuICAgIGNvbnN0IHN1YnNjcmlwdGlvbiA9IChfZXZlbnQ6IElwY1JlbmRlcmVyRXZlbnQsIC4uLmFyZ3M6IHVua25vd25bXSkgPT5cclxuICAgICAgY2FsbGJhY2soLi4uYXJncylcclxuICAgIGlwY1JlbmRlcmVyLm9uKGNoYW5uZWwsIHN1YnNjcmlwdGlvbilcclxuXHJcbiAgICByZXR1cm4gKCkgPT4ge1xyXG4gICAgICBpcGNSZW5kZXJlci5yZW1vdmVMaXN0ZW5lcihjaGFubmVsLCBzdWJzY3JpcHRpb24pXHJcbiAgICB9XHJcbiAgfSxcclxuICBhc3luYyBzZWxlY3REaXJlY3RvcnkoKSB7XHJcbiAgICByZXR1cm4gaXBjUmVuZGVyZXIuaW52b2tlKCdzZWxlY3QtZGlyZWN0b3J5JylcclxuICB9LFxyXG4gIGFzeW5jIGdldFNlcnZlclN0YXR1cygpIHtcclxuICAgIHJldHVybiBpcGNSZW5kZXJlci5pbnZva2UoJ2dldC1zZXJ2ZXItc3RhdHVzJylcclxuICB9LFxyXG4gIGFzeW5jIGdldERlZmF1bHREaXJlY3RvcnkoKSB7XHJcbiAgICByZXR1cm4gaXBjUmVuZGVyZXIuaW52b2tlKCdnZXQtZGVmYXVsdC1kaXJlY3RvcnknKVxyXG4gIH0sXHJcbiAgYXN5bmMgc2V0RGVmYXVsdERpcmVjdG9yeShkaXJlY3Rvcnk6IHN0cmluZykge1xyXG4gICAgcmV0dXJuIGlwY1JlbmRlcmVyLmludm9rZSgnc2V0LWRlZmF1bHQtZGlyZWN0b3J5JywgZGlyZWN0b3J5KVxyXG4gIH0sXHJcbiAgYXN5bmMgZ2V0U2VydmVyUG9ydCgpIHtcclxuICAgIHJldHVybiBpcGNSZW5kZXJlci5pbnZva2UoJ2dldC1zZXJ2ZXItcG9ydCcpXHJcbiAgfSxcclxuICBhc3luYyBnZXRWZW5kb3JzKCkge1xyXG4gICAgcmV0dXJuIGlwY1JlbmRlcmVyLmludm9rZSgnZ2V0LXZlbmRvcnMnKVxyXG4gIH0sXHJcbiAgYXN5bmMgZ2V0QVNOcyhzdG9yZUlkOiBzdHJpbmcsIHZlbmRvcklkOiBzdHJpbmcsIGRhdGU6IERhdGUpIHtcclxuICAgIHJldHVybiBpcGNSZW5kZXJlci5pbnZva2UoJ2dldC1hc24tYnktdmVuZG9yJywgc3RvcmVJZCwgdmVuZG9ySWQsIGRhdGUpXHJcbiAgfSxcclxuICBhc3luYyBnZXRQZGZGaWxlcyhkaXJlY3RvcnlQYXRoOiBzdHJpbmcpIHtcclxuICAgIHJldHVybiBpcGNSZW5kZXJlci5pbnZva2UoJ2dldC1wZGYtZmlsZXMnLCBkaXJlY3RvcnlQYXRoKVxyXG4gIH0sXHJcbiAgYXN5bmMgcmVhZFBkZkZpbGUoZmlsZVBhdGg6IHN0cmluZykge1xyXG4gICAgcmV0dXJuIGlwY1JlbmRlcmVyLmludm9rZSgncmVhZC1wZGYtZmlsZScsIGZpbGVQYXRoKVxyXG4gIH0sXHJcbiAgYXN5bmMgZ2V0RXhpc3RpbmdEaXJlY3Rvcnkoc3RvcmVJZDogU3RvcmVJZCwgdHlwZTogVGFiVHlwZSwgZGF0ZTogRGF0ZSkge1xyXG4gICAgcmV0dXJuIGlwY1JlbmRlcmVyLmludm9rZSgnZ2V0LWV4aXN0aW5nLWRpcmVjdG9yeScsIHN0b3JlSWQsIHR5cGUsIGRhdGUpXHJcbiAgfSxcclxuICBhc3luYyBnZXRFeGlzdGluZ0RpcmVjdG9yaWVzKHN0b3JlSWQ6IFN0b3JlSWQsIGRhdGU6IERhdGUpIHtcclxuICAgIHJldHVybiBpcGNSZW5kZXJlci5pbnZva2UoJ2dldC1leGlzdGluZy1kaXJlY3RvcmllcycsIHN0b3JlSWQsIGRhdGUpXHJcbiAgfSxcclxuICBvblNlcnZlclN0YXR1c0NoYW5nZShjYWxsYmFjazogKHN0YXR1czogYW55KSA9PiB2b2lkKSB7XHJcbiAgICBjb25zdCBzdWJzY3JpcHRpb24gPSAoX2V2ZW50OiBJcGNSZW5kZXJlckV2ZW50LCBzdGF0dXM6IGFueSkgPT5cclxuICAgICAgY2FsbGJhY2soc3RhdHVzKVxyXG4gICAgaXBjUmVuZGVyZXIub24oJ3NlcnZlci1zdGF0dXMnLCBzdWJzY3JpcHRpb24pXHJcblxyXG4gICAgcmV0dXJuICgpID0+IHtcclxuICAgICAgaXBjUmVuZGVyZXIucmVtb3ZlTGlzdGVuZXIoJ3NlcnZlci1zdGF0dXMnLCBzdWJzY3JpcHRpb24pXHJcbiAgICB9XHJcbiAgfSxcclxuICAvLyBVcGRhdGUtcmVsYXRlZCBBUElzXHJcbiAgYXN5bmMgY2hlY2tGb3JVcGRhdGVzKCkge1xyXG4gICAgcmV0dXJuIGlwY1JlbmRlcmVyLmludm9rZSgnY2hlY2stZm9yLXVwZGF0ZXMnKVxyXG4gIH0sXHJcbiAgYXN5bmMgZG93bmxvYWRVcGRhdGUoKSB7XHJcbiAgICByZXR1cm4gaXBjUmVuZGVyZXIuaW52b2tlKCdkb3dubG9hZC11cGRhdGUnKVxyXG4gIH0sXHJcbiAgYXN5bmMgaW5zdGFsbFVwZGF0ZSgpIHtcclxuICAgIHJldHVybiBpcGNSZW5kZXJlci5pbnZva2UoJ2luc3RhbGwtdXBkYXRlJylcclxuICB9LFxyXG4gIGFzeW5jIGdldEFwcFZlcnNpb24oKSB7XHJcbiAgICByZXR1cm4gaXBjUmVuZGVyZXIuaW52b2tlKCdnZXQtYXBwLXZlcnNpb24nKVxyXG4gIH0sXHJcbiAgb25VcGRhdGVTdGF0dXMoY2FsbGJhY2s6IChzdGF0dXM6IGFueSkgPT4gdm9pZCkge1xyXG4gICAgY29uc3Qgc3Vic2NyaXB0aW9uID0gKF9ldmVudDogSXBjUmVuZGVyZXJFdmVudCwgc3RhdHVzOiBhbnkpID0+XHJcbiAgICAgIGNhbGxiYWNrKHN0YXR1cylcclxuICAgIGlwY1JlbmRlcmVyLm9uKCd1cGRhdGUtc3RhdHVzJywgc3Vic2NyaXB0aW9uKVxyXG5cclxuICAgIHJldHVybiAoKSA9PiB7XHJcbiAgICAgIGlwY1JlbmRlcmVyLnJlbW92ZUxpc3RlbmVyKCd1cGRhdGUtc3RhdHVzJywgc3Vic2NyaXB0aW9uKVxyXG4gICAgfVxyXG4gIH0sXHJcbiAgYXN5bmMgcmVuYW1lRG9jdW1lbnQoZGF0YToge1xyXG4gICAgZmlsZVBhdGg6IHN0cmluZ1xyXG4gICAgbmV3RmlsZU5hbWU6IHN0cmluZ1xyXG4gICAgZG9jdW1lbnRUeXBlOiBzdHJpbmdcclxuICAgIHZlbmRvcklkPzogc3RyaW5nXHJcbiAgICBpbnZvaWNlTnVtYmVyPzogc3RyaW5nXHJcbiAgICBpbnZvaWNlRGF0ZT86IHN0cmluZ1xyXG4gIH0pIHtcclxuICAgIHJldHVybiBpcGNSZW5kZXJlci5pbnZva2UoJ3JlbmFtZS1kb2N1bWVudCcsIGRhdGEpXHJcbiAgfSxcclxuICBhc3luYyBkZWxldGVGaWxlKGZpbGVQYXRoOiBzdHJpbmcpIHtcclxuICAgIHJldHVybiBpcGNSZW5kZXJlci5pbnZva2UoJ2RlbGV0ZS1maWxlJywgZmlsZVBhdGgpXHJcbiAgfSxcclxuICBhc3luYyBtb3ZlRmlsZVRvWkRyaXZlKGRhdGE6IHtcclxuICAgIGZpbGVQYXRoOiBzdHJpbmdcclxuICAgIGRpcmVjdG9yeVBhdGg6IHN0cmluZ1xyXG4gICAgZG9jdW1lbnRUeXBlOiBzdHJpbmdcclxuICB9KSB7XHJcbiAgICByZXR1cm4gaXBjUmVuZGVyZXIuaW52b2tlKCdtb3ZlLWZpbGUtdG8temRyaXZlJywgZGF0YSlcclxuICB9LFxyXG4gIGFzeW5jIHVwbG9hZFBkZihkYXRhOiB7XHJcbiAgICBmaWxlUGF0aDogc3RyaW5nXHJcbiAgICB2ZW5kb3JJZDogc3RyaW5nXHJcbiAgICBpbnZvaWNlTnVtYmVyOiBzdHJpbmdcclxuICAgIGludm9pY2VEYXRlOiBzdHJpbmdcclxuICAgIGRvY3VtZW50VHlwZTogc3RyaW5nXHJcbiAgICBzdG9yZTogU3RvcmVJZFxyXG4gICAgaW52b2ljZVRvdGFsOiBudW1iZXJcclxuICB9KSB7XHJcbiAgICByZXR1cm4gaXBjUmVuZGVyZXIuaW52b2tlKCd1cGxvYWQtcGRmJywgZGF0YSlcclxuICB9LFxyXG4gIC8vIENlcnRpZmljYXRlLXJlbGF0ZWQgQVBJc1xyXG4gIGFzeW5jIGNoZWNrQ2VydGlmaWNhdGVJbnN0YWxsZWQoKSB7XHJcbiAgICByZXR1cm4gaXBjUmVuZGVyZXIuaW52b2tlKCdjaGVjay1jZXJ0aWZpY2F0ZS1pbnN0YWxsZWQnKVxyXG4gIH0sXHJcbiAgYXN5bmMgaW5zdGFsbENlcnRpZmljYXRlKCkge1xyXG4gICAgcmV0dXJuIGlwY1JlbmRlcmVyLmludm9rZSgnaW5zdGFsbC1jZXJ0aWZpY2F0ZScpXHJcbiAgfVxyXG4gIC8vIG9uTG9nTWVzc2FnZShjYWxsYmFjazogKG1lc3NhZ2U6IHN0cmluZykgPT4gdm9pZCkge1xyXG4gIC8vICAgY29uc3Qgc3Vic2NyaXB0aW9uID0gKF9ldmVudDogSXBjUmVuZGVyZXJFdmVudCwgbWVzc2FnZTogc3RyaW5nKSA9PlxyXG4gIC8vICAgICBjYWxsYmFjayhtZXNzYWdlKVxyXG4gIC8vICAgaXBjUmVuZGVyZXIub24oJ2xvZy1tZXNzYWdlJywgc3Vic2NyaXB0aW9uKVxyXG5cclxuICAvLyAgIHJldHVybiAoKSA9PiB7XHJcbiAgLy8gICAgIGlwY1JlbmRlcmVyLnJlbW92ZUxpc3RlbmVyKCdsb2ctbWVzc2FnZScsIHN1YnNjcmlwdGlvbilcclxuICAvLyAgIH1cclxuICAvLyB9XHJcbn1cclxuXHJcbmNvbnRleHRCcmlkZ2UuZXhwb3NlSW5NYWluV29ybGQoJ2lwYycsIGhhbmRsZXIpXHJcblxyXG5leHBvcnQgdHlwZSBJcGNIYW5kbGVyID0gdHlwZW9mIGhhbmRsZXJcclxuIl0sIm5hbWVzIjpbImNvbnRleHRCcmlkZ2UiLCJpcGNSZW5kZXJlciIsImhhbmRsZXIiLCJzZW5kIiwiY2hhbm5lbCIsInZhbHVlIiwib24iLCJjYWxsYmFjayIsInN1YnNjcmlwdGlvbiIsIl9ldmVudCIsImFyZ3MiLCJyZW1vdmVMaXN0ZW5lciIsInNlbGVjdERpcmVjdG9yeSIsImludm9rZSIsImdldFNlcnZlclN0YXR1cyIsImdldERlZmF1bHREaXJlY3RvcnkiLCJzZXREZWZhdWx0RGlyZWN0b3J5IiwiZGlyZWN0b3J5IiwiZ2V0U2VydmVyUG9ydCIsImdldFZlbmRvcnMiLCJnZXRBU05zIiwic3RvcmVJZCIsInZlbmRvcklkIiwiZGF0ZSIsImdldFBkZkZpbGVzIiwiZGlyZWN0b3J5UGF0aCIsInJlYWRQZGZGaWxlIiwiZmlsZVBhdGgiLCJnZXRFeGlzdGluZ0RpcmVjdG9yeSIsInR5cGUiLCJnZXRFeGlzdGluZ0RpcmVjdG9yaWVzIiwib25TZXJ2ZXJTdGF0dXNDaGFuZ2UiLCJzdGF0dXMiLCJjaGVja0ZvclVwZGF0ZXMiLCJkb3dubG9hZFVwZGF0ZSIsImluc3RhbGxVcGRhdGUiLCJnZXRBcHBWZXJzaW9uIiwib25VcGRhdGVTdGF0dXMiLCJyZW5hbWVEb2N1bWVudCIsImRhdGEiLCJkZWxldGVGaWxlIiwibW92ZUZpbGVUb1pEcml2ZSIsInVwbG9hZFBkZiIsImNoZWNrQ2VydGlmaWNhdGVJbnN0YWxsZWQiLCJpbnN0YWxsQ2VydGlmaWNhdGUiLCJleHBvc2VJbk1haW5Xb3JsZCJdLCJzb3VyY2VSb290IjoiIn0=