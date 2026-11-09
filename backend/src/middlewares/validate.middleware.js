import sendResponse from "../utils/response.util.js";



const validate = (schema) => {
    return (req, res, next) => {

        const result = schema.safeParse(req.body);

        if (!result.success) {

            const errors = result.error.issues.map((issue) => ({
                field: issue.path.join("."),
                message: issue.message
            }));

            return sendResponse(
                res,
                400,
                "Validation Failed",
                false,
                errors
            );
        }

        req.body = result.data;

        next();
    };
};

export default validate;