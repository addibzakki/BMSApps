export const command = {
  // POST
  black: function(data) {
    console.log('\x1b[30m' + data + '\x1b[0m');
  },
  red: function(data) {
    console.log('\x1b[31m' + data + '\x1b[0m');
  },
  green: function(data) {
    console.log('\x1b[32m' + data + '\x1b[0m');
  },
  yellow: function(data) {
    console.log('\x1b[33m' + data + '\x1b[0m');
  },
  blue: function(data) {
    console.log('\x1b[34m' + data + '\x1b[0m');
  },
  magenta: function(data) {
    console.log('\x1b[35m' + data + '\x1b[0m');
  },
  cyan: function(data) {
    console.log('\x1b[36m' + data + '\x1b[0m');
  },
  white: function(data) {
    console.log('\x1b[37m' + data + '\x1b[0m');
  },
};

export const cmd = {
  yellow: function(data) {
    console.log('%c' + data, 'color: #bada55');
  },
  cyan: function(data) {
    console.log('%c' + data, 'color: #398AB9');
  },
  blue: function(data) {
    console.log('%c' + data, 'color: #398AB9');
  },
  red: function(data) {
    console.log('%c' + data, 'color: #FC4F4F');
  },
  green: function(data) {
    console.group('%c' + data, 'color: #8BDB81');
  },
  pink: function(data) {
    console.group('%c' + data, 'color: #FF87CA');
  },
  purple: function(data) {
    console.group('%c' + data, 'color: #753188');
  },
  random: function(data) {
    console.log(
      '%c' + data,
      'color: #' + Math.floor(Math.random() * 16777215).toString(16),
    );
  },
};
