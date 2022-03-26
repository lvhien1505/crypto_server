const apiResponse = require('../helpers/apiResponse');

exports.getAll = (Model) => async (req, res) => {
    try {
        let doc = await Model.find().sort({ createdAt: -1 }).lean();
        return apiResponse.successResponseWithData(res, 'OK', doc);
    } catch (error) {
        return apiResponse.ErrorResponse(res, error);
    }
};

exports.create = (Model) => async (req, res) => {
    try {
        let customer = await Model.create(req.body);
        return apiResponse.successResponse(res, 'Doc created !');
    } catch (error) {
        return apiResponse.ErrorResponse(res, error);
    }
};

exports.update = (Model) => async (req, res) => {
    try {
        let doc = await Model.findByIdAndUpdate(req.body._id, req.body);
        return apiResponse.successResponse(res, 'Doc updated !');
    } catch (error) {
        return apiResponse.ErrorResponse(res, error);
    }
};

exports.remove = (Model) => async (req, res) => {
    try {
        let doc = await Model.findByIdAndDelete(req.body._id);
        return apiResponse.successResponse(res, 'Doc removed !');
    } catch (error) {
        return apiResponse.ErrorResponse(res, error);
    }
};
