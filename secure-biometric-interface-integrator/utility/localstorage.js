const device_info_keyname = "deviceInfo";
const discover_keyname = "discover";

const localStorageService = {
  /**
   * @returns deviceInfoList
   */
  getDeviceInfos: () => {
    return JSON.parse(localStorage.getItem(device_info_keyname) || "[]");
  },

    getDiscoveredDevices: () => {
      return JSON.parse(localStorage.getItem(discover_keyname) || "[]");
    },

  /**
   * Clear the cache of discovered devices
   */
  clearDiscoveredDevices: () => {
    if (localStorage.getItem(discover_keyname)) {
      localStorage.removeItem(discover_keyname);
    }
  },

  /**
   * Clear the cache of deviceInfo
   */
  clearDeviceInfos: () => {
    if (localStorage.getItem(device_info_keyname)) {
      localStorage.removeItem(device_info_keyname);
    }
  },

  /**
   * cache discoveredDevices against the port no.
   * @param {int} port
   * @param {*} discoveredDevices
   */
  addDiscoveredDevices: (port, discoveredDevices) => {

    //initialize if empty
    if (!localStorage.getItem(discover_keyname)) {
      localStorage.setItem(discover_keyname, JSON.stringify({}));
    }

    const discovered_data = localStorage.getItem(discover_keyname);
    let discoveredMap = JSON.parse(discovered_data);
    if (discoveredMap !== null) {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(discoveredDevices, "text/xml");
        const rdServiceElement = xmlDoc.querySelector("RDService");
        let discovered = {};
        if(rdServiceElement) {
             discovered["status"] = rdServiceElement.getAttribute('status');
             discovered["info"] = rdServiceElement.getAttribute('info');

             const interfaceElements = rdServiceElement.querySelectorAll('Interface');
             interfaceElements.forEach(interfaceEl => {
                 const id = interfaceEl.getAttribute('id');
                 const path = interfaceEl.getAttribute('path');
                 if (id && path) { // Only add if both id and path exist
                     discovered[id] = path;
                 }
             });
             discoveredMap[port] = discovered;
             localStorage.setItem(discover_keyname, JSON.stringify(discoveredMap));
         }
    }
  },

  /**
   * cache deviceInfo against the port no.
   * @param {int} port
   * @param {*} decodedDeviceInfo
   */
  addDeviceInfos: (port, decodedDeviceInfo) => {
    let deviceInfo = {};

    //initialize if empty
    if (!localStorage.getItem(device_info_keyname)) {
      localStorage.setItem(device_info_keyname, JSON.stringify(deviceInfo));
    }
    const device_data = localStorage.getItem(device_info_keyname);
    const discovered_data = localStorage.getItem(discover_keyname);
    if (device_data !== null) {
      deviceInfo = JSON.parse(device_data);
      let currentData = discovered_data[port];
      if(currentData) {
        decodedDeviceInfo["deviceStatus"] = currentData["status"];
      }
      deviceInfo[port] = decodedDeviceInfo;
      localStorage.setItem(device_info_keyname, JSON.stringify(deviceInfo));
    }
  },
};

export { localStorageService };
