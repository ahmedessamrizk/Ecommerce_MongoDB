const dataMethod = ['body', 'params', 'query', 'headers'];

export const validation = (schema) => {
    return (req, res, next) => {
        const ErrList = [];
        dataMethod.forEach(key => {
            if(schema[key])
            {
                const validationResult = schema[key].validate(req[key],{abortEarly: false});
                if(validationResult?.error?.details)
                {
                    ErrList.push(validationResult.error.details);
                }
            }
        });
        ErrList.length? res.json({message: "Validation error", err: ErrList}) : next()
    }
}