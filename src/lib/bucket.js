'use strict';

const env = require('./environment');
const S3 = require('aws-sdk/clients/s3');
const { Credentials } = require('aws-sdk');

class Bucket {

  constructor(s3AccessKey, s3SecretKey) {
    this.s3 = new S3({
      credentials: new Credentials({
        accessKeyId: s3AccessKey,
        secretAccessKey: s3SecretKey,
      })
    });
  }

  static singleton(s3AccessKey, s3SecretKey,) {
    if (!Bucket.instance) {

      if (!(s3AccessKey && s3SecretKey)) {
        throw new Error('Um dos parâmetros do S3 tem um valor inválido.');
      }

      Bucket.instance = new Bucket(s3AccessKey, s3SecretKey);
    }

    return Bucket.instance;
  }

  /**
   * @description Lista todas as keys do bucket
   * @param {Object} options Opções de pesquisa `{ Bucket: nome_bucket_origem }`
   * @param {Array} keys Conjunto de keys
   *
   * @returns {Promise} Conjunto de keys
   */
  list(options, keys = []) {
    return new Promise((resolve, reject) => {
      this.s3.listObjectsV2(options).promise()
        .then(({ Contents, IsTruncated, NextContinuationToken }) => {
          keys.push(...Contents);
          if (!IsTruncated) {
            resolve(keys.map(e => e.Key));
          } else {
            resolve(this.list({ ...options, ContinuationToken: NextContinuationToken }, keys));
          }
        }).catch(reject);
    });
  }

  /**
   * @description Adiciona um arquivo fake
   * @param {Object} options Opções de input `{ Bucket: nome_bucket_destino }`
   */
  add(options) {
    return new Promise((resolve, reject) => {
      if (options.Body) options.Body = Buffer.from('');
      this.s3.putObject(options).promise()
        .then(res => resolve(res))
        .catch(reject);
    });
  }

  /**
   * @description Encontra a diferença entre dois buckets e epelha os arquivos
   * @param {String} from Nome do bucket de origem
   * @param {String} to Nome do bucket de destino
   */
  async mirror(from, to) {
    try {
      const source = await this.list({ Bucket: from });
      const destiny = await this.list({ Bucket: to });
      const difference = source.filter(e => !destiny.includes(e));

      console.info(`Arquivos encontrados ${difference.length}.`);
      for (const Key of difference) {
        console.info(`Replicando ${Key}`);
        const options = { Key, Bucket: to };
        await this.add(options);
      }
      console.info(`${difference.length} arquivos replicados com sucesso!`);

    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = Bucket.singleton(env.s3AccessKey, env.s3SecretKey);
