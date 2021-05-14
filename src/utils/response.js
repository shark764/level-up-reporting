export const success = (args) => ({
  status: 'success',
  requestId: args.requestId,
  data: args.data || { message: 'Operation was successful.' },
});

export const errorCodeMap = {
  400: 'LUL-MOB000 - Bad request check body/params',
  401: 'LUL-MOB001 - Authentication required',
  402: 'LUL-MOB002 - Payment required',
  403: 'LUL-MOB003 - Forbidden Action',
  404: 'LUL-MOB004 - Not found',
  409: 'LUL-MOB009 - Resource is already in use',
  422: 'LUL-MOB022 - Request Failed For Model',
};

export const error = (args) => {
  const { code, errors, requestId } = args;
  const message = args.message || errorCodeMap[code] || 'Server Error';

  return {
    status: 'error',
    requestId,
    error: {
      code,
      message,
      errors,
    },
  };
};
