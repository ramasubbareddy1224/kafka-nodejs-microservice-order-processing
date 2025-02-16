# Kafka Node.js Microservice Order Processing

This repository contains a Node.js microservice for processing orders using Apache Kafka.

## Prerequisites

- Docker

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/yourusername/kafka-nodejs-microservice-order-processing.git
    cd kafka-nodejs-microservice-order-processing
    ```

2. Install dependencies:
    ```sh
    npm install
    ```

3. Configure environment variables:
    Create a `.env` file in the root directory and add the following variables:
    ```env
    KAFKA_BROKER=localhost:9092
    KAFKA_TOPIC=order_topic
    ```

## Running the Service

1. Start Kafka (if not already running):
    ```sh
    docker-compose up -d
    ```

2. Start the microservice:
    ```sh
    npm start
    ```

## Usage

- The microservice listens for order messages on the specified Kafka topic.
- Processed orders are logged to the console.
