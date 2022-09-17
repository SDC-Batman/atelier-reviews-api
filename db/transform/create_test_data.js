// first 5 rows
// const fs = require('fs');
// const path = require('path');
// const csv = require('fast-csv');

// fs.createReadStream(path.resolve(__dirname, '../../data/', 'reviews.csv'))
//     .pipe(csv.parse({ headers: true, maxRows: 5 }))
//     .on('error', error => console.error(error))
//     .on('data', row => console.log(row))
//     .on('end', rowCount => console.log(`Parsed ${rowCount} rows`));


// second attempt
// const fs = require('fs');
// const path = require('path');
// const csv = require('fast-csv');

// fs.createReadStream(path.resolve(__dirname, '../../data/test/', 'reviews_photos_test.csv'))
//     .pipe(csv.parse({ headers: true, maxRows: 5 }))
//     .transform(data => ({
//       new_id: data.id,
//       new_review_id: data.review_id,
//       new_url: data.url,
//     }))
//     .on('error', error => console.error(error))
//     .on('data', row => console.log(row))
//     .on('end', rowCount => console.log(`Parsed ${rowCount} rows`));



const fs = require('fs');
const path = require('path');
const csv = require('fast-csv');

const inputFile = path.resolve(__dirname, '../../data/test/', 'reviews.csv')
const outputFile = path.resolve(__dirname, '../../data/test/', 'reviews_transformed.json')

const readStream = fs.createReadStream(inputFile);
const writeStream = fs.createWriteStream(outputFile);

const parse = csv.parse(
  {
    headers: true,
    maxRows: 5
  });

const transform = csv.format({ headers: true })
  .transform((row) => (
     {
      id: Number(row.id),
      product_id: Number(row.product_id),
      rating: Number(row.rating),
      date: row.date,
      summary: row.summary,
      body: row.body,
      recommend: row.recommend === 'true' ? true : false,
      reported: row.reported === 'true' ? true : false,
      reviewer_name: row.reviewer_name,
      reviewer_email: row.reviewer_email,
      response: row.response === 'null' ? null : row.response,
      helpfulness: Number(row.helpfulness),
    }
  ));

fs.createReadStream(inputFile)
  .pipe(parse)
  .pipe(transform)
  .pipe(writeStream);

// insertMany(reviewsArray, callback) {
  // callback recursively calls insertMany with next batch
  // wait for insertMany is complete before inserting next batch
//}
// initialize an empty array to store all reviews

// csv.parseStream(readStream, { headers: true, maxRows: 5 })
//     // .pipe(csv.parse({ headers: true, maxRows: 5 }))
//     .transform(row => ({
//       id: Number(row.id),
//       product_id: Number(row.product_id),
//       rating: Number(row.rating),
//       date: row.date,
//       summary: row.summary,
//       body: row.body,
//       recommend: row.recommend === 'true' ? true : false,
//       reported: row.reported === 'true' ? true : false,
//       reviewer_name: row.reviewer_name,
//       reviewer_email: row.reviewer_email,
//       response: row.response === 'null' ? null : row.response,
//       helpfulness: Number(row.helpfulness),
//     }))
//     .on('error', error => console.error(error))
//     .on('data', row => console.log(row))
//     // .pipe(writeStream)
//     .on('end', rowCount => console.log(`Parsed ${rowCount} rows`));
//     // .on('end', insertMany());


    // .on









// const fs = require('fs');
// const csv = require('fast-csv');
// const path = require('path');

// const inputFile = path.resolve(__dirname, '../../data/test/', 'reviews.csv')
// const outputFile = path.resolve(__dirname, '../../data/test/', 'reviews_transformed.csv')

// function getDir() {
//   if (process.pkg) {
//     return path.resolve(process.execPath + "/..");
//   } else {
//     return path.join(require.main ? require.main.path : process.cwd());
//   }
// }

// (async function () {

//   const writeStream = fs.createWriteStream(outputFile);

//   const parse = csv.parse(
//     {
//       ignoreEmpty: true,
//       discardUnmappedColumns: true,
//       headers: ['beta','alpha','redundant','charlie'],
//     });

//   const transform = csv.format({ headers: true })
//     .transform((row) => (
//       {
//         NewAlpha: row.alpha, // reordered
//         NewBeta: row.beta,
//         NewCharlie: row.charlie,
//         // redundant is dropped
//         // delta is not loaded by parse() above
//       }
//     ));

//   const stream = fs.createReadStream(inputFile)
//     .pipe(parse)
//     .pipe(transform)
//     .pipe(writeStream);
//   })();