# Kafka Node.js Microservice Order Processing

This repository contains a Node.js microservices for processing orders using Apache Kafka.
Read more @https://millionvisit.blogspot.com/2025/03/Order-Processing-with-Kafka-Nodejs-Microservices-MySQL.html

## Prerequisites

- Docker

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/yourusername/kafka-nodejs-microservice-order-processing.git
    cd kafka-nodejs-microservice-order-processing
    ```

2. Start all the Docker containers by running the following command.:
    ```sh
    docker-compose up -d --build
    ```

## Order Microservice:

The Order Microservice is responsible for accepting new order requests, storing the details in the Order Database, and publishing the order information to the Kafka Order Topic.

## Payment Microservice:

The Payment Microservice listens to the Kafka Order Topic for new orders, processes payments, and stores payment statuses in a database, and publishing the payment information to the Kafka Payment Topic.
