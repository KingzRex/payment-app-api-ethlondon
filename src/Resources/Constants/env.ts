const APP_ENV = checkEnvVariable("APP_ENV") as "development" | "production";

const FLUTTERWAVE_SECRET_KEY =
    APP_ENV === "development"
        ? checkEnvVariable("FLUTTERWAVE_TEST_SECRET_KEY")
        : checkEnvVariable("FLUTTERWAVE_LIVE_SECRET_KEY");

const FLUTTERWAVE_BASE_URL = checkEnvVariable("FLUTTERWAVE_BASE_URL");

const DYNAMIC_PUBLIC_KEY = checkEnvVariable("DYNAMIC_PUBLIC_KEY");

const CIRCLE_ENTITY_SECRET = checkEnvVariable("CIRCLE_ENTITY_SECRET");

const CIRCLE_API_KEY =
    APP_ENV === "development" ? checkEnvVariable("CIRCLE_TEST_API_KEY") : checkEnvVariable("CIRCLE_LIVE_API_KEY");

const CIRCLE_DEV_WALLET_SET_ID = checkEnvVariable("CIRCLE_DEV_WALLET_SET_ID");

const CIRCLE_DEV_WALLET_ID = checkEnvVariable("CIRCLE_DEV_WALLET_ID");

const OFF_RAMP_BASE_URL = checkEnvVariable("OFF_RAMP_BASE_URL");

function checkEnvVariable(variableName: string) {
    const value = process.env[variableName];
    if (!value) {
        throw new Error(`Missing value for environment variable: ${variableName}`);
    }
    return value;
}

export {
    FLUTTERWAVE_SECRET_KEY,
    FLUTTERWAVE_BASE_URL,
    DYNAMIC_PUBLIC_KEY,
    APP_ENV,
    CIRCLE_API_KEY,
    CIRCLE_ENTITY_SECRET,
    CIRCLE_DEV_WALLET_SET_ID,
    CIRCLE_DEV_WALLET_ID, OFF_RAMP_BASE_URL,
};