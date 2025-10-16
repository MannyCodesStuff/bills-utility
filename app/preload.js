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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJlbG9hZC5qcyIsIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0QsTzs7Ozs7Ozs7OztBQ1ZBOzs7Ozs7VUNBQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsaUNBQWlDLFdBQVc7V0FDNUM7V0FDQTs7Ozs7V0NQQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7Ozs7Ozs7QUNKdUU7QUFFdkUsTUFBTUUsT0FBTyxHQUFHO0VBQ2RDLElBQUlBLENBQUNDLE9BQWUsRUFBRUMsS0FBYyxFQUFFO0lBQ3BDSixpREFBVyxDQUFDRSxJQUFJLENBQUNDLE9BQU8sRUFBRUMsS0FBSyxDQUFDO0VBQ2xDLENBQUM7RUFDREMsRUFBRUEsQ0FBQ0YsT0FBZSxFQUFFRyxRQUFzQyxFQUFFO0lBQzFELE1BQU1DLFlBQVksR0FBR0EsQ0FBQ0MsTUFBd0IsRUFBRSxHQUFHQyxJQUFlLEtBQ2hFSCxRQUFRLENBQUMsR0FBR0csSUFBSSxDQUFDO0lBQ25CVCxpREFBVyxDQUFDSyxFQUFFLENBQUNGLE9BQU8sRUFBRUksWUFBWSxDQUFDO0lBRXJDLE9BQU8sTUFBTTtNQUNYUCxpREFBVyxDQUFDVSxjQUFjLENBQUNQLE9BQU8sRUFBRUksWUFBWSxDQUFDO0lBQ25ELENBQUM7RUFDSCxDQUFDO0VBQ0QsTUFBTUksZUFBZUEsQ0FBQSxFQUFHO0lBQ3RCLE9BQU9YLGlEQUFXLENBQUNZLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQztFQUMvQyxDQUFDO0VBQ0QsTUFBTUMsZUFBZUEsQ0FBQSxFQUFHO0lBQ3RCLE9BQU9iLGlEQUFXLENBQUNZLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQztFQUNoRCxDQUFDO0VBQ0QsTUFBTUUsbUJBQW1CQSxDQUFBLEVBQUc7SUFDMUIsT0FBT2QsaURBQVcsQ0FBQ1ksTUFBTSxDQUFDLHVCQUF1QixDQUFDO0VBQ3BELENBQUM7RUFDRCxNQUFNRyxtQkFBbUJBLENBQUNDLFNBQWlCLEVBQUU7SUFDM0MsT0FBT2hCLGlEQUFXLENBQUNZLE1BQU0sQ0FBQyx1QkFBdUIsRUFBRUksU0FBUyxDQUFDO0VBQy9ELENBQUM7RUFDRCxNQUFNQyxhQUFhQSxDQUFBLEVBQUc7SUFDcEIsT0FBT2pCLGlEQUFXLENBQUNZLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQztFQUM5QyxDQUFDO0VBQ0QsTUFBTU0sVUFBVUEsQ0FBQSxFQUFHO0lBQ2pCLE9BQU9sQixpREFBVyxDQUFDWSxNQUFNLENBQUMsYUFBYSxDQUFDO0VBQzFDLENBQUM7RUFDRCxNQUFNTyxPQUFPQSxDQUFDQyxPQUFlLEVBQUVDLFFBQWdCLEVBQUVDLElBQVUsRUFBRTtJQUMzRCxPQUFPdEIsaURBQVcsQ0FBQ1ksTUFBTSxDQUFDLG1CQUFtQixFQUFFUSxPQUFPLEVBQUVDLFFBQVEsRUFBRUMsSUFBSSxDQUFDO0VBQ3pFLENBQUM7RUFDRCxNQUFNQyxXQUFXQSxDQUFDQyxhQUFxQixFQUFFO0lBQ3ZDLE9BQU94QixpREFBVyxDQUFDWSxNQUFNLENBQUMsZUFBZSxFQUFFWSxhQUFhLENBQUM7RUFDM0QsQ0FBQztFQUNELE1BQU1DLFdBQVdBLENBQUNDLFFBQWdCLEVBQUU7SUFDbEMsT0FBTzFCLGlEQUFXLENBQUNZLE1BQU0sQ0FBQyxlQUFlLEVBQUVjLFFBQVEsQ0FBQztFQUN0RCxDQUFDO0VBQ0QsTUFBTUMsb0JBQW9CQSxDQUFDUCxPQUFnQixFQUFFUSxJQUFhLEVBQUVOLElBQVUsRUFBRTtJQUN0RSxPQUFPdEIsaURBQVcsQ0FBQ1ksTUFBTSxDQUFDLHdCQUF3QixFQUFFUSxPQUFPLEVBQUVRLElBQUksRUFBRU4sSUFBSSxDQUFDO0VBQzFFLENBQUM7RUFDRCxNQUFNTyxzQkFBc0JBLENBQUNULE9BQWdCLEVBQUVFLElBQVUsRUFBRTtJQUN6RCxPQUFPdEIsaURBQVcsQ0FBQ1ksTUFBTSxDQUFDLDBCQUEwQixFQUFFUSxPQUFPLEVBQUVFLElBQUksQ0FBQztFQUN0RSxDQUFDO0VBQ0RRLG9CQUFvQkEsQ0FBQ3hCLFFBQStCLEVBQUU7SUFDcEQsTUFBTUMsWUFBWSxHQUFHQSxDQUFDQyxNQUF3QixFQUFFdUIsTUFBVyxLQUN6RHpCLFFBQVEsQ0FBQ3lCLE1BQU0sQ0FBQztJQUNsQi9CLGlEQUFXLENBQUNLLEVBQUUsQ0FBQyxlQUFlLEVBQUVFLFlBQVksQ0FBQztJQUU3QyxPQUFPLE1BQU07TUFDWFAsaURBQVcsQ0FBQ1UsY0FBYyxDQUFDLGVBQWUsRUFBRUgsWUFBWSxDQUFDO0lBQzNELENBQUM7RUFDSCxDQUFDO0VBQ0Q7RUFDQSxNQUFNeUIsZUFBZUEsQ0FBQSxFQUFHO0lBQ3RCLE9BQU9oQyxpREFBVyxDQUFDWSxNQUFNLENBQUMsbUJBQW1CLENBQUM7RUFDaEQsQ0FBQztFQUNELE1BQU1xQixjQUFjQSxDQUFBLEVBQUc7SUFDckIsT0FBT2pDLGlEQUFXLENBQUNZLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQztFQUM5QyxDQUFDO0VBQ0QsTUFBTXNCLGFBQWFBLENBQUEsRUFBRztJQUNwQixPQUFPbEMsaURBQVcsQ0FBQ1ksTUFBTSxDQUFDLGdCQUFnQixDQUFDO0VBQzdDLENBQUM7RUFDRCxNQUFNdUIsYUFBYUEsQ0FBQSxFQUFHO0lBQ3BCLE9BQU9uQyxpREFBVyxDQUFDWSxNQUFNLENBQUMsaUJBQWlCLENBQUM7RUFDOUMsQ0FBQztFQUNEd0IsY0FBY0EsQ0FBQzlCLFFBQStCLEVBQUU7SUFDOUMsTUFBTUMsWUFBWSxHQUFHQSxDQUFDQyxNQUF3QixFQUFFdUIsTUFBVyxLQUN6RHpCLFFBQVEsQ0FBQ3lCLE1BQU0sQ0FBQztJQUNsQi9CLGlEQUFXLENBQUNLLEVBQUUsQ0FBQyxlQUFlLEVBQUVFLFlBQVksQ0FBQztJQUU3QyxPQUFPLE1BQU07TUFDWFAsaURBQVcsQ0FBQ1UsY0FBYyxDQUFDLGVBQWUsRUFBRUgsWUFBWSxDQUFDO0lBQzNELENBQUM7RUFDSCxDQUFDO0VBQ0QsTUFBTThCLGNBQWNBLENBQUNDLElBT3BCLEVBQUU7SUFDRCxPQUFPdEMsaURBQVcsQ0FBQ1ksTUFBTSxDQUFDLGlCQUFpQixFQUFFMEIsSUFBSSxDQUFDO0VBQ3BELENBQUM7RUFDRCxNQUFNQyxVQUFVQSxDQUFDYixRQUFnQixFQUFFO0lBQ2pDLE9BQU8xQixpREFBVyxDQUFDWSxNQUFNLENBQUMsYUFBYSxFQUFFYyxRQUFRLENBQUM7RUFDcEQsQ0FBQztFQUNELE1BQU1jLGdCQUFnQkEsQ0FBQ0YsSUFJdEIsRUFBRTtJQUNELE9BQU90QyxpREFBVyxDQUFDWSxNQUFNLENBQUMscUJBQXFCLEVBQUUwQixJQUFJLENBQUM7RUFDeEQsQ0FBQztFQUNELE1BQU1HLFNBQVNBLENBQUNILElBUWYsRUFBRTtJQUNELE9BQU90QyxpREFBVyxDQUFDWSxNQUFNLENBQUMsWUFBWSxFQUFFMEIsSUFBSSxDQUFDO0VBQy9DLENBQUM7RUFDRDtFQUNBLE1BQU1JLHlCQUF5QkEsQ0FBQSxFQUFHO0lBQ2hDLE9BQU8xQyxpREFBVyxDQUFDWSxNQUFNLENBQUMsNkJBQTZCLENBQUM7RUFDMUQsQ0FBQztFQUNELE1BQU0rQixrQkFBa0JBLENBQUEsRUFBRztJQUN6QixPQUFPM0MsaURBQVcsQ0FBQ1ksTUFBTSxDQUFDLHFCQUFxQixDQUFDO0VBQ2xEO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7O0VBRUE7RUFDQTtFQUNBO0VBQ0E7QUFDRixDQUFDO0FBRURiLG1EQUFhLENBQUM2QyxpQkFBaUIsQ0FBQyxLQUFLLEVBQUUzQyxPQUFPLENBQUMsQyIsInNvdXJjZXMiOlsid2VicGFjazovL2JpbGxzLXV0aWxpdHkvd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovL2JpbGxzLXV0aWxpdHkvZXh0ZXJuYWwgbm9kZS1jb21tb25qcyBcImVsZWN0cm9uXCIiLCJ3ZWJwYWNrOi8vYmlsbHMtdXRpbGl0eS93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9iaWxscy11dGlsaXR5L3dlYnBhY2svcnVudGltZS9jb21wYXQgZ2V0IGRlZmF1bHQgZXhwb3J0Iiwid2VicGFjazovL2JpbGxzLXV0aWxpdHkvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2JpbGxzLXV0aWxpdHkvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9iaWxscy11dGlsaXR5L3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vYmlsbHMtdXRpbGl0eS8uL21haW4vcHJlbG9hZC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShbXSwgZmFjdG9yeSk7XG5cdGVsc2Uge1xuXHRcdHZhciBhID0gZmFjdG9yeSgpO1xuXHRcdGZvcih2YXIgaSBpbiBhKSAodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnID8gZXhwb3J0cyA6IHJvb3QpW2ldID0gYVtpXTtcblx0fVxufSkoZ2xvYmFsLCAoKSA9PiB7XG5yZXR1cm4gIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiZWxlY3Ryb25cIik7IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSAobW9kdWxlKSA9PiB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdCgpID0+IChtb2R1bGVbJ2RlZmF1bHQnXSkgOlxuXHRcdCgpID0+IChtb2R1bGUpO1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCB7IFRhYlR5cGUgfSBmcm9tICdAL2NvbXBvbmVudHMvYmlsbC1tYW5hZ2VyJ1xuaW1wb3J0IHsgU3RvcmVJZCB9IGZyb20gJ0AvaG9va3MvdXNlLXN0b3JlJ1xuaW1wb3J0IHsgY29udGV4dEJyaWRnZSwgaXBjUmVuZGVyZXIsIElwY1JlbmRlcmVyRXZlbnQgfSBmcm9tICdlbGVjdHJvbidcblxuY29uc3QgaGFuZGxlciA9IHtcbiAgc2VuZChjaGFubmVsOiBzdHJpbmcsIHZhbHVlOiB1bmtub3duKSB7XG4gICAgaXBjUmVuZGVyZXIuc2VuZChjaGFubmVsLCB2YWx1ZSlcbiAgfSxcbiAgb24oY2hhbm5lbDogc3RyaW5nLCBjYWxsYmFjazogKC4uLmFyZ3M6IHVua25vd25bXSkgPT4gdm9pZCkge1xuICAgIGNvbnN0IHN1YnNjcmlwdGlvbiA9IChfZXZlbnQ6IElwY1JlbmRlcmVyRXZlbnQsIC4uLmFyZ3M6IHVua25vd25bXSkgPT5cbiAgICAgIGNhbGxiYWNrKC4uLmFyZ3MpXG4gICAgaXBjUmVuZGVyZXIub24oY2hhbm5lbCwgc3Vic2NyaXB0aW9uKVxuXG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIGlwY1JlbmRlcmVyLnJlbW92ZUxpc3RlbmVyKGNoYW5uZWwsIHN1YnNjcmlwdGlvbilcbiAgICB9XG4gIH0sXG4gIGFzeW5jIHNlbGVjdERpcmVjdG9yeSgpIHtcbiAgICByZXR1cm4gaXBjUmVuZGVyZXIuaW52b2tlKCdzZWxlY3QtZGlyZWN0b3J5JylcbiAgfSxcbiAgYXN5bmMgZ2V0U2VydmVyU3RhdHVzKCkge1xuICAgIHJldHVybiBpcGNSZW5kZXJlci5pbnZva2UoJ2dldC1zZXJ2ZXItc3RhdHVzJylcbiAgfSxcbiAgYXN5bmMgZ2V0RGVmYXVsdERpcmVjdG9yeSgpIHtcbiAgICByZXR1cm4gaXBjUmVuZGVyZXIuaW52b2tlKCdnZXQtZGVmYXVsdC1kaXJlY3RvcnknKVxuICB9LFxuICBhc3luYyBzZXREZWZhdWx0RGlyZWN0b3J5KGRpcmVjdG9yeTogc3RyaW5nKSB7XG4gICAgcmV0dXJuIGlwY1JlbmRlcmVyLmludm9rZSgnc2V0LWRlZmF1bHQtZGlyZWN0b3J5JywgZGlyZWN0b3J5KVxuICB9LFxuICBhc3luYyBnZXRTZXJ2ZXJQb3J0KCkge1xuICAgIHJldHVybiBpcGNSZW5kZXJlci5pbnZva2UoJ2dldC1zZXJ2ZXItcG9ydCcpXG4gIH0sXG4gIGFzeW5jIGdldFZlbmRvcnMoKSB7XG4gICAgcmV0dXJuIGlwY1JlbmRlcmVyLmludm9rZSgnZ2V0LXZlbmRvcnMnKVxuICB9LFxuICBhc3luYyBnZXRBU05zKHN0b3JlSWQ6IHN0cmluZywgdmVuZG9ySWQ6IHN0cmluZywgZGF0ZTogRGF0ZSkge1xuICAgIHJldHVybiBpcGNSZW5kZXJlci5pbnZva2UoJ2dldC1hc24tYnktdmVuZG9yJywgc3RvcmVJZCwgdmVuZG9ySWQsIGRhdGUpXG4gIH0sXG4gIGFzeW5jIGdldFBkZkZpbGVzKGRpcmVjdG9yeVBhdGg6IHN0cmluZykge1xuICAgIHJldHVybiBpcGNSZW5kZXJlci5pbnZva2UoJ2dldC1wZGYtZmlsZXMnLCBkaXJlY3RvcnlQYXRoKVxuICB9LFxuICBhc3luYyByZWFkUGRmRmlsZShmaWxlUGF0aDogc3RyaW5nKSB7XG4gICAgcmV0dXJuIGlwY1JlbmRlcmVyLmludm9rZSgncmVhZC1wZGYtZmlsZScsIGZpbGVQYXRoKVxuICB9LFxuICBhc3luYyBnZXRFeGlzdGluZ0RpcmVjdG9yeShzdG9yZUlkOiBTdG9yZUlkLCB0eXBlOiBUYWJUeXBlLCBkYXRlOiBEYXRlKSB7XG4gICAgcmV0dXJuIGlwY1JlbmRlcmVyLmludm9rZSgnZ2V0LWV4aXN0aW5nLWRpcmVjdG9yeScsIHN0b3JlSWQsIHR5cGUsIGRhdGUpXG4gIH0sXG4gIGFzeW5jIGdldEV4aXN0aW5nRGlyZWN0b3JpZXMoc3RvcmVJZDogU3RvcmVJZCwgZGF0ZTogRGF0ZSkge1xuICAgIHJldHVybiBpcGNSZW5kZXJlci5pbnZva2UoJ2dldC1leGlzdGluZy1kaXJlY3RvcmllcycsIHN0b3JlSWQsIGRhdGUpXG4gIH0sXG4gIG9uU2VydmVyU3RhdHVzQ2hhbmdlKGNhbGxiYWNrOiAoc3RhdHVzOiBhbnkpID0+IHZvaWQpIHtcbiAgICBjb25zdCBzdWJzY3JpcHRpb24gPSAoX2V2ZW50OiBJcGNSZW5kZXJlckV2ZW50LCBzdGF0dXM6IGFueSkgPT5cbiAgICAgIGNhbGxiYWNrKHN0YXR1cylcbiAgICBpcGNSZW5kZXJlci5vbignc2VydmVyLXN0YXR1cycsIHN1YnNjcmlwdGlvbilcblxuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICBpcGNSZW5kZXJlci5yZW1vdmVMaXN0ZW5lcignc2VydmVyLXN0YXR1cycsIHN1YnNjcmlwdGlvbilcbiAgICB9XG4gIH0sXG4gIC8vIFVwZGF0ZS1yZWxhdGVkIEFQSXNcbiAgYXN5bmMgY2hlY2tGb3JVcGRhdGVzKCkge1xuICAgIHJldHVybiBpcGNSZW5kZXJlci5pbnZva2UoJ2NoZWNrLWZvci11cGRhdGVzJylcbiAgfSxcbiAgYXN5bmMgZG93bmxvYWRVcGRhdGUoKSB7XG4gICAgcmV0dXJuIGlwY1JlbmRlcmVyLmludm9rZSgnZG93bmxvYWQtdXBkYXRlJylcbiAgfSxcbiAgYXN5bmMgaW5zdGFsbFVwZGF0ZSgpIHtcbiAgICByZXR1cm4gaXBjUmVuZGVyZXIuaW52b2tlKCdpbnN0YWxsLXVwZGF0ZScpXG4gIH0sXG4gIGFzeW5jIGdldEFwcFZlcnNpb24oKSB7XG4gICAgcmV0dXJuIGlwY1JlbmRlcmVyLmludm9rZSgnZ2V0LWFwcC12ZXJzaW9uJylcbiAgfSxcbiAgb25VcGRhdGVTdGF0dXMoY2FsbGJhY2s6IChzdGF0dXM6IGFueSkgPT4gdm9pZCkge1xuICAgIGNvbnN0IHN1YnNjcmlwdGlvbiA9IChfZXZlbnQ6IElwY1JlbmRlcmVyRXZlbnQsIHN0YXR1czogYW55KSA9PlxuICAgICAgY2FsbGJhY2soc3RhdHVzKVxuICAgIGlwY1JlbmRlcmVyLm9uKCd1cGRhdGUtc3RhdHVzJywgc3Vic2NyaXB0aW9uKVxuXG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIGlwY1JlbmRlcmVyLnJlbW92ZUxpc3RlbmVyKCd1cGRhdGUtc3RhdHVzJywgc3Vic2NyaXB0aW9uKVxuICAgIH1cbiAgfSxcbiAgYXN5bmMgcmVuYW1lRG9jdW1lbnQoZGF0YToge1xuICAgIGZpbGVQYXRoOiBzdHJpbmdcbiAgICBuZXdGaWxlTmFtZTogc3RyaW5nXG4gICAgZG9jdW1lbnRUeXBlOiBzdHJpbmdcbiAgICB2ZW5kb3JJZD86IHN0cmluZ1xuICAgIGludm9pY2VOdW1iZXI/OiBzdHJpbmdcbiAgICBpbnZvaWNlRGF0ZT86IHN0cmluZ1xuICB9KSB7XG4gICAgcmV0dXJuIGlwY1JlbmRlcmVyLmludm9rZSgncmVuYW1lLWRvY3VtZW50JywgZGF0YSlcbiAgfSxcbiAgYXN5bmMgZGVsZXRlRmlsZShmaWxlUGF0aDogc3RyaW5nKSB7XG4gICAgcmV0dXJuIGlwY1JlbmRlcmVyLmludm9rZSgnZGVsZXRlLWZpbGUnLCBmaWxlUGF0aClcbiAgfSxcbiAgYXN5bmMgbW92ZUZpbGVUb1pEcml2ZShkYXRhOiB7XG4gICAgZmlsZVBhdGg6IHN0cmluZ1xuICAgIGRpcmVjdG9yeVBhdGg6IHN0cmluZ1xuICAgIGRvY3VtZW50VHlwZTogc3RyaW5nXG4gIH0pIHtcbiAgICByZXR1cm4gaXBjUmVuZGVyZXIuaW52b2tlKCdtb3ZlLWZpbGUtdG8temRyaXZlJywgZGF0YSlcbiAgfSxcbiAgYXN5bmMgdXBsb2FkUGRmKGRhdGE6IHtcbiAgICBmaWxlUGF0aDogc3RyaW5nXG4gICAgdmVuZG9ySWQ6IHN0cmluZ1xuICAgIGludm9pY2VOdW1iZXI6IHN0cmluZ1xuICAgIGludm9pY2VEYXRlOiBzdHJpbmdcbiAgICBkb2N1bWVudFR5cGU6IHN0cmluZ1xuICAgIHN0b3JlOiBTdG9yZUlkXG4gICAgaW52b2ljZVRvdGFsOiBudW1iZXJcbiAgfSkge1xuICAgIHJldHVybiBpcGNSZW5kZXJlci5pbnZva2UoJ3VwbG9hZC1wZGYnLCBkYXRhKVxuICB9LFxuICAvLyBDZXJ0aWZpY2F0ZS1yZWxhdGVkIEFQSXNcbiAgYXN5bmMgY2hlY2tDZXJ0aWZpY2F0ZUluc3RhbGxlZCgpIHtcbiAgICByZXR1cm4gaXBjUmVuZGVyZXIuaW52b2tlKCdjaGVjay1jZXJ0aWZpY2F0ZS1pbnN0YWxsZWQnKVxuICB9LFxuICBhc3luYyBpbnN0YWxsQ2VydGlmaWNhdGUoKSB7XG4gICAgcmV0dXJuIGlwY1JlbmRlcmVyLmludm9rZSgnaW5zdGFsbC1jZXJ0aWZpY2F0ZScpXG4gIH1cbiAgLy8gb25Mb2dNZXNzYWdlKGNhbGxiYWNrOiAobWVzc2FnZTogc3RyaW5nKSA9PiB2b2lkKSB7XG4gIC8vICAgY29uc3Qgc3Vic2NyaXB0aW9uID0gKF9ldmVudDogSXBjUmVuZGVyZXJFdmVudCwgbWVzc2FnZTogc3RyaW5nKSA9PlxuICAvLyAgICAgY2FsbGJhY2sobWVzc2FnZSlcbiAgLy8gICBpcGNSZW5kZXJlci5vbignbG9nLW1lc3NhZ2UnLCBzdWJzY3JpcHRpb24pXG5cbiAgLy8gICByZXR1cm4gKCkgPT4ge1xuICAvLyAgICAgaXBjUmVuZGVyZXIucmVtb3ZlTGlzdGVuZXIoJ2xvZy1tZXNzYWdlJywgc3Vic2NyaXB0aW9uKVxuICAvLyAgIH1cbiAgLy8gfVxufVxuXG5jb250ZXh0QnJpZGdlLmV4cG9zZUluTWFpbldvcmxkKCdpcGMnLCBoYW5kbGVyKVxuXG5leHBvcnQgdHlwZSBJcGNIYW5kbGVyID0gdHlwZW9mIGhhbmRsZXJcbiJdLCJuYW1lcyI6WyJjb250ZXh0QnJpZGdlIiwiaXBjUmVuZGVyZXIiLCJoYW5kbGVyIiwic2VuZCIsImNoYW5uZWwiLCJ2YWx1ZSIsIm9uIiwiY2FsbGJhY2siLCJzdWJzY3JpcHRpb24iLCJfZXZlbnQiLCJhcmdzIiwicmVtb3ZlTGlzdGVuZXIiLCJzZWxlY3REaXJlY3RvcnkiLCJpbnZva2UiLCJnZXRTZXJ2ZXJTdGF0dXMiLCJnZXREZWZhdWx0RGlyZWN0b3J5Iiwic2V0RGVmYXVsdERpcmVjdG9yeSIsImRpcmVjdG9yeSIsImdldFNlcnZlclBvcnQiLCJnZXRWZW5kb3JzIiwiZ2V0QVNOcyIsInN0b3JlSWQiLCJ2ZW5kb3JJZCIsImRhdGUiLCJnZXRQZGZGaWxlcyIsImRpcmVjdG9yeVBhdGgiLCJyZWFkUGRmRmlsZSIsImZpbGVQYXRoIiwiZ2V0RXhpc3RpbmdEaXJlY3RvcnkiLCJ0eXBlIiwiZ2V0RXhpc3RpbmdEaXJlY3RvcmllcyIsIm9uU2VydmVyU3RhdHVzQ2hhbmdlIiwic3RhdHVzIiwiY2hlY2tGb3JVcGRhdGVzIiwiZG93bmxvYWRVcGRhdGUiLCJpbnN0YWxsVXBkYXRlIiwiZ2V0QXBwVmVyc2lvbiIsIm9uVXBkYXRlU3RhdHVzIiwicmVuYW1lRG9jdW1lbnQiLCJkYXRhIiwiZGVsZXRlRmlsZSIsIm1vdmVGaWxlVG9aRHJpdmUiLCJ1cGxvYWRQZGYiLCJjaGVja0NlcnRpZmljYXRlSW5zdGFsbGVkIiwiaW5zdGFsbENlcnRpZmljYXRlIiwiZXhwb3NlSW5NYWluV29ybGQiXSwic291cmNlUm9vdCI6IiJ9