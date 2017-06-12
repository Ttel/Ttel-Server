/**
 * Created by PandaApe on 07/05/2017.
 * Email: whailong2010@gmail.com
 */

const ApiError = require('./api_error');

const AppInfoError = {}

AppInfoError.ParamError = (msg) => {

    return new ApiError('PARAM_ERROR', -101, msg);
};

AppInfoError.AppNotFoundError = (msg) => {

    return new ApiError('APP_NOT_FOUND_ERROR', -111, msg);
};

module.exports = AppInfoError;

