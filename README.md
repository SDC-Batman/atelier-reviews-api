# Atlier Reviews API

## Deployment Instructions:

### Create Database

1. Sign into [AWS](https://aws.amazon.com/) console and create a new EC2 instance.

2. Download the following packages:

- Node.js and npm
  ```
    sudo apt update
    sudo apt install nodejs npm
  ```

  Confirm successful install:
  ```
    node --version
    npm --version
  ```

- MongoDB
  ```
    wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -

    echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

    sudo apt-get update

    sudo apt-get install -y mongodb-org
  ```
  See more details in the official [MongoDB documentation](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-ubuntu/). Instructions for [troubleshooting issues](https://www.mongodb.com/docs/manual/reference/installation-ubuntu-community-troubleshooting/).

- Mongosh
  ```
    wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -

    echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

    sudo apt-get update

    sudo apt-get install -y mongodb-mongosh
  ```

4. Start MongoDB:
  ```
    sudo service mongodb start
  ```

  Verify process started successfully:
  ```
    sudo service mongod status

  ```

5. Create `reviews` database with Mongosh:
  ```
    mongosh
  ```
  ```
    use reviews;
  ```



6. Load data into database:
  ```
    npm run load-data
  ```

7. Transform the data in the database with MongoDB aggregation pipelines:
  ```
    npm run transform-data
  ```

8. Confirm data loaded and transformed correctly:
  ```
  ```

### Create API Server

1. Sign into [AWS](https://aws.amazon.com/) console and create a new EC2 instance.

2. Download the following packages:

- Node.js and npm
  ```
    sudo apt update
    sudo apt install nodejs npm
  ```

  Confirm successful install:
  ```
    node --version
    npm --version
  ```

3. Clone the [Atelier Reviews API repository](https://github.com/SDC-Batman/atelier-reviews-api.git).
  ```
    git clone https://github.com/SDC-Batman/atelier-reviews-api.git
  ```