/**
 * Created by PandaApe on 05/05/2017.
 * Email: whailong2010@gmail.com
 */


/**
 * 自定义Api异常
 */
class ApiError extends Error {

    //构造方法
    constructor(name,code, msg) {
        super();

        this.name = name;
        this.code = code;
        this.message = msg || '';
    }
}

module.exports = ApiError;
