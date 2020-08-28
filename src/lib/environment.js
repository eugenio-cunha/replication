'use strict';

const camelCase = obj => {

  if (typeof (obj) !== 'object') return obj;
  for (const oldName in obj) {
    const newName = oldName.toLowerCase().replace(/(_[a-z])/g, $1 => `${$1[1].toUpperCase()}`);

    if (newName !== oldName) {
      if (Object.prototype.hasOwnProperty.call(obj, oldName)) {
        obj[newName] = obj[oldName];
        delete obj[oldName];
      }
    }

    if (obj[newName] && typeof (obj[newName]) === 'object') {
      obj[newName] = this.camelCase(obj[newName]);
    }

  }
  return obj;
};

const environment = env => {

  const output = {};
  const names = [
    'S3_ACCESS_KEY',
    'S3_SECRET_KEY',
    'FROM_BUCKET',
    'TO_BUCKET',
    'SCHEDULE',
    'TZ'
  ];

  for (const name of names) {
    if (!env[name]) throw new Error(`A variável de ambiente ${name}, não pode ser nula!`);
    output[name] = env[name];
  }

  return camelCase(output);
};

module.exports = environment(process.env);
