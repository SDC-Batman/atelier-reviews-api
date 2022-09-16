const path = require('path');
const csv = require('csvtojson');
const fs = require('fs');

// console.log(__dirname);
// const inputFile = path.resolve(__dirname, '../../data/test/', 'reviews_transformed.csv')
// console.log(inputFile);

const csvFilePath=path.resolve(__dirname, '../../data/test/', 'reviews_transformed.csv');

csv({
    colParser: {
        "id": Number,
        "product_id": Number,
        "rating": Number,
        // "date": function(item){
        //     let date = Date(item).;
        //     // const iso = date.toISOString();
        //     // item = Date.parse(item);
        //     return date;
        // },
        "recommend": function(item){
            return item === "true" ? true : false;
        },
        "reported": function(item){
            return item === "true" ? true : false;
        },
        "helpfulness": Number,
    }
})
.fromFile(csvFilePath)
.then((jsonObj)=>{
    // jsonObj.id = Number(jsonObj.id);
    console.log(jsonObj);
    /**
     * [
     * 	{a:"1", b:"2", c:"3"},
     * 	{a:"4", b:"5". c:"6"}
     * ]
     */
     fs.writeFile("reviews_transformed_output.json", jsonObj, function(err) {
         if (err) {
             console.log(err);
         } else {
            console.log("success!");
         }

     });

})



// console.log(jsonArray);

// Async / await usage
// const jsonArray=await csv().fromFile(csvFilePath);
// console.log(jsonArray);