# Atelier Reviews Service - Deployment Instructions

### Create Mongo Database

1. Sign into [AWS](https://aws.amazon.com/) console and create a new EC2 instance.

2. Download the following packages:

- Node.js and npm
```
  sudo apt update
  sudo apt install nodejs npm
```

- Confirm successful install:
```
  node --version
  npm --version
```

- Install MongoDB
```
  wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -

  echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

  sudo apt-get update

  sudo apt-get install -y mongodb-org
```
See more details in the official [MongoDB documentation](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-ubuntu/). Instructions for [troubleshooting issues](https://www.mongodb.com/docs/manual/reference/installation-ubuntu-community-troubleshooting/).

- Install Mongosh (i.e. Mongo Shell)
```
  sudo apt-get install -y mongodb-mongosh
```

4. Start MongoDB and verify process started successfully.
```
  sudo service mongod start
  sudo service mongod status
```

5. Create `reviews` database with Mongosh:
```
  mongosh
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


### OPTION #2: Use MongoDB utilities to copy the database from local machine to remote EC2

9. Dump the MongoDB with `mongodump` from your local machine:

```
  // Entire database
  cd /data/backup
  mongodump -d=reviews

  // Single collection
  mongodump -d=reviews -c=reviews_transformed
```

10. Transfer the dumped MongoDB by connecting to remote EC2 instance.
```
  chmod 400 Atelier-Reviews-Database.pem

  // entire folder
  scp -i Atelier-Reviews-Database.pem -r reviews ubuntu@ec2-18-237-173-10.us-west-2.compute.amazonaws.com:~/data

  // individual files
  scp -i Atelier-Reviews-Database-Oregon.pem reviews_transformed.bson ubuntu@ec2-18-237-173-10.us-west-2.compute.amazonaws.com:~/data/reviews
```

11. Restore the MongoDB on the remote EC2 instance from the MongoDB dump.
```
  cd data
  mongorestore -d=reviews --drop reviews
```

12. Now, we are going to add authentication to the MongoDB.

- ssh into your MongoDB EC2 instance.

- Create a new user with password.
  ```
    db.createUser({
      user: 'thomashepner',
      pwd: 'YOUR PASSWORD HERE',
      roles: [{ role: 'readWrite', db:'reviews'}]
    });

  ```

- Enable authorization of the MongoDB.
```
  sudo vim /etc/mongod.conf
```

Change `bindIp` to anywhere `0.0.0.0` and enable `security` with `authorization: 'enabled'`.
```
  # network interfaces
  net:
    port: 27017
    bindIp: 0.0.0.0

  security:
    authorization: 'enabled'
```

Restart MongoDB on the EC2.
```
   sudo service mongod start
   sudo service mongod status
```

- Login with authentication:
```
  mongosh "mongodb://54.159.194.148:27017/reviews" --username thomashepner -p <INSERT PASSWORD HERE>
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

4. Load project dependencies.
```
  cd atelier-reviews-api
  npm install
```

5. Create a .env file with your MongoDB EC2 connection string
```
  sudo vim .env
  // paste environment variables into the file and save it
```

6. Run the server
  ```
    npm run server
  ```

### Create Nginx Load Balancer Linked to Loader.io for Stress Testing

1. Create new Amazon EC2 Instance

2. Install nginx:
```
  sudo apt update
  sudo apt install nginx
```

3. Verify nginx is installed and running:
```
  sudo nginx -v
  sudo service nginx status
```

4. Disable the default virtual host:
```
  sudo unlink /etc/nginx/sites-enabled/default
```

5. Create load balancer file:
```
  cd /etc/nginx/sites-available/

  sudo vim load-balancer.conf
```

6. Modify the following code with your servers and paste into vim editor:

```
  upstream backend {
      server ec2-100-26-108-182.compute-1.amazonaws.com:3000;
      server ec2-54-166-195-27.compute-1.amazonaws.com:3000;
  }

  server {
      listen 80;

      location / {
          proxy_pass http://backend;
      }

      location ~ \\.txt {
        root /var/www/tokens;
      }
  }

```

7. Activate the directives:
```
  sudo ln -s /etc/nginx/sites-available/load-balancer.conf /etc/nginx/sites-enabled/load-balancer.conf
```

8. Add loader.io verification token:

- cd to root folder

- cd to /var/www/

- create tokens folder and cd into it
```
  sudo mkdir tokens
  cd tokens
```

- Save the token file in the directory:
```
  sudo vim loaderio-loaderio-<verification-token>.txt
```

8. Reload NGINX:
```
  sudo nginx -s reload
```

9. Add port 80 to the EC2 security group for the servers.

10. Test the load balancer using the IPv4 address without the port in Postman.

