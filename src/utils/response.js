export const success = (args) => ({
  status: 'success',
  requestId: args.requestId,
  data: args.data || { message: 'Operation was successful.' },
});

export const errorCodeMap = {
  400: 'LUL-REP000 - Bad request check body/params',
  401: 'LUL-REP001 - Authentication required',
  403: 'LUL-REP003 - Forbidden Action',
  404: 'LUL-REP004 - Not found',
  409: 'LUL-REP009 - Resource is already in use',
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
