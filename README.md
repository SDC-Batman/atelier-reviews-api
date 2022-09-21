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

4. Install MongoDB Database Tools:
  ```
  sudo dpkg -l mongodb-database-tools
  ```

4. Start MongoDB:
  ```
    sudo service mongod start
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

### OPTION #1: Build the database from source files

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

### OPTION #2: Use MongoDB Utilities to copy the database from local to remote EC2

9. Dump the MongoDB with `mongodump` from your local machine:

```
  cd /data/backup
  mongodump -d=reviews
```

10. Transfer the dumped MongoDB by connecting to remote EC2 instance.
```
  chmod 400 Atelier-Reviews-Database-New.pem
  scp -i Atelier-Reviews-Database-New.pem -r reviews ubuntu@ec2-54-196-8-197.compute-1.amazonaws.com:~/data
```

11. Restore the MongoDB on the remote EC2 instance from the MongoDB dump.
```
  cd data
  mongorestore -d=reviews reviews
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