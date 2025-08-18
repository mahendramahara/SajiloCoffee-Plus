import { success } from "../utils/apiResponse.js";

export const testController = (req, res) => {
  return success(res, { timestamp: new Date().toISOString(), status: "API Working" }, "Test endpoint successful");
};
