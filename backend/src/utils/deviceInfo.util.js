import { UAParser } from "ua-parser-js";

function deviceInfo(req){
    const parser = new UAParser(req.headers["user-agent"]);
    const result = parser.getResult();


    
const deviceInfo = {
    ipAddress: req.ip,

    userAgent: req.headers["user-agent"],

    browser: result.browser.name || "Unknown",

    operatingSystem: result.os.name || "Unknown",

    deviceType: result.device.type || "desktop",

    deviceName: result.device.model || result.device.vendor || "Unknown Device"
};

return deviceInfo;
}

export default deviceInfo