import { Kafka } from "kafkajs";
import { config } from "./config";

const brokers = config.KAFKA_BROKERS.split(",");

const client = new Kafka({
  clientId: "auth-service",
  brokers,
});

export const producer = client.producer();
