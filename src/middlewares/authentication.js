import { getAppCheck } from "firebase-admin/app-check";

const appCheckVerification = async (req, res, next) => {
  const appCheckToken = req.header("X-Firebase-AppCheck");

  if (!appCheckToken) {
    res.status(401);
    return next("Authentication Middleware Error: Unauthorized");
  }

  try {
    const decoded = await getAppCheck().verifyToken(appCheckToken);
    console.log({ decoded });
    // If verifyToken() succeeds, continue with the next middleware
    // function in the stack.
    return next();
  } catch (err) {
    res.status(401);
    console.log({ err });
    return next("Authentication Middleware Error: Unauthorized");
  }
};

export default appCheckVerification;
