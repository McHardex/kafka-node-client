import kafka from 'kafka-node';

const client = new kafka.KafkaClient({ kafkaHost: 'localhost:9092', clientId: 'kafka-node-client' });

const Consumer = kafka.Consumer;

const consumer = new Consumer(
  client,
  [
    { topic: 'INVOICE_TT', partitions: 1, offset: 0 }
  ],
  {
    autoCommit: false,
    autoCommitIntervalMs: 1000,
    fetchMaxBytes: 1024 * 1024,
    fetchMinBytes: 1,
    fromOffset: true,
    encoding: 'utf8',
    protocol: 'utf8'
  }
);

export default consumer;
