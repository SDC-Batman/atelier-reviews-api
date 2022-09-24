# Atelier Reviews Service

The Atelier Reviews service supports the Reviews section of the [Atelier product page](http://54.184.84.48:3030/products/).

![](/docs/imgs/Ratings-Reviews.PNG)

## Summary

Atelier's reviews service is powered by 4 Amazon Web Services EC2 instances:
- Nginx Load Balancing Server
- Host Server 1
- Host Server 2
- Mongo Database Server

The service supports 500 client requests per second with an average response time of 4 to 10 milliseconds per response.


## Why MongoDB?

Both Mongo (NoSQL) and Postgres (SQL) databases were considered for the service before implementation.

MongoDB was selected over Postgres because the service required the following:

- complex, nested data types in responses (i.e. JSON arrays and objects)

- aggregations including counts and averages of ratings, recommendations, and characteristics

MongoDB was purpose-built to handle these exact requirements and enables fast, simple queries.


## Schema Design

There are two primary collections in the MongoDB that powers the service:
* reviews
* reviews_meta

`reviews_meta` contains metadata including counts and averages of ratings, characteristics, and recommendations from the `reviews` collection.

The `reviews` collection schema includes two fields, `characteristics` and `photos`, that are embedded documents for improved performance and efficiency.

![](/docs/imgs/Mongo-Schema-Design.PNG)

The `reviews_meta` collection is created via MongoDB aggregation pipelines after the `reviews` collection has been created.


## Performance Optimization & Tuning

- before indexing

- after basic indexing

- after load balancer

  - 1 server

  - 2 servers

  - 3 servers

- after additional indexing


## Further Documentation

- [Deployment Instructions](docs/DEPLOYMENT-README.md)
