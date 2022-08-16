const LOGS_ON = true;
let REMIND_ONCE = false;

 const bluConsoleLog = (...args) => {
  if (process.env.NODE_ENV === 'development' && LOGS_ON) {
    console.log(...args);
  }
  if (process.env.NODE_ENV === 'development' && !LOGS_ON && REMIND_ONCE === false) {
    alert('Console logs deactivated');
    REMIND_ONCE = true;
  }
}

export {
  bluConsoleLog
}