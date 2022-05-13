const jwt = require('jsonwebtoken');

const privateKey = '';

jwt.sign({ foo: 'bar' }, 'privateKey', { algorithm: 'HS256' },
function(err, token) {
  if(err) console.error(err);
  console.log(token);
});