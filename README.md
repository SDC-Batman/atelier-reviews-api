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

### Local Testing:

Before adding any indexes to the `reviews` collection, individual testing in Postman showed response times in the 2000 to 3000 millisecond range.

![](/docs/imgs/Local-Testing/Morgan-No-Indexing.PNG)

Local, randomized load testing with K6 of the `product_id` parameter at the `reviews` endpoint showed average response time of 3.8 seconds at 10 client requests per second (rps). At 100 rps, response times increased to an average of 31 seconds per response.

![](/docs/imgs/Local-Testing/K6-No-Indexing-100-RPS.PNG)

After indexing on `product_id`, average response time at 100 rps, fell
to just 8 milliseconds, a 99.8% reduction in average response time!

![](/docs/imgs/Local-Testing/K6-Indexing-100-RPS.PNG)

With indexing, K6 testing showed that the service could handle 1,000 rps with an average response time of just 50 milliseconds (ms)!

Individual Testing: 2000 - 3000 millisecond response times.

### Deployment:

After deploying the database and server to AWS EC2 instances, stress testing with [loader.io](loader.io) demonstrated that the service could handle throughput of 400 rps with 31 ms average response time.

![](/docs/imgs/Load-Balancer/Single-Server-400-RPS.PNG)



### Load Balancing:


### Further Optimizations:
- after load balancer

  - 1 server

  - 2 servers

  - 3 servers

- after additional indexing


## Further Documentation

- [Deployment Instructions](docs/DEPLOYMENT-README.md)
