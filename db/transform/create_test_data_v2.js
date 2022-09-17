const path = require('path');
const csv = require('csvtojson');
const fs = require('fs');

const inputFilePath = path.resolve(__dirname, '../../data/test/', 'reviews_transformed.csv');
const outputFilePath = path.resolve(__dirname, '../../data/test/', 'reviews_test.json');

csv({
    colParser: {
        "id": Number,
        "product_id": Number,
        "rating": Number,
        // "date": function(item){
        // },
        "recommend": function(item){
            return item === "true" ? true : false;
        },
        "reported": function(item){
            return item === "true" ? true : false;
        },
        "response": function(item){
            return item === "" ? null : item;
        },
        "helpfulness": Number,
    }
})
.fromFile(inputFilePath)
.then((jsonObj)=>{
    // console.log(jsonObj[0])
    // console.log("sucess!");
    fs.writeFile(outputFilePath, JSON.stringify(jsonObj), function(err) {
        if (err) {
            console.log(err);
        } else {
            // console.log(jsonObj);
            console.log("success!");
        }
    });
})
