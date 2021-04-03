export function log(type, msg, ...args) {
  switch (type) {
    case 'info':
      console.log('\x1b[34m%s\x1b[0m', msg, ...args);
      break;
    case 'success':
      console.log('\x1b[35m%s\x1b[0m', msg, ...args);
      break;
    case 'warning':
      console.log('\x1b[33m%s\x1b[0m', msg, ...args);
      break;
    case 'error':
      console.log('\x1b[31m%s\x1b[0m', msg, ...args);
      break;
    default:
      console.log('\x1b[36m%s\x1b[0m', msg, ...args);
      break;
  }
}
