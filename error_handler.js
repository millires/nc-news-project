exports.handlePsqlErrors = (error, request, response, next) => {
    if (error.code === '22P02') {
        response.status(400).send({ msg: "bad request" })
    } else
        next(error)
}

exports.handleCustomErrors = (error, request, response, next) => {
    if (error.status && error.msg) {
        response.status(error.status).send({ msg: error.msg });
    }else
        next(error);
};

exports.handleServerErrors = (error, request, response, next) => {
    response.status(500).send({ msg: "internal server error" })
}