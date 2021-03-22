const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

async function main(){
const uri = "mongodb+srv://admin:admin@cluster0.curam.mongodb.net/sample_training?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true , useUnifiedTopology: true , connectTimeoutMS: 30000 , keepAlive: 1} );

await client.connect().then( (data) => { console.log("Connected")}, (err) => { console.log(err)} );

/*
databasesList = await client.db().admin().listDatabases();
console.log("Databases:");
databasesList.databases.forEach(db => console.log(` - ${db.name}`));
*/

/*
const movies = client.db("sample_mflix").collection("movies").find();
console.log(movies);
*/
 client.db("sample_mflix").collection("comments").aggregate([
  {
     $lookup:
        {
           from: "movies",
           localField: "movie_id",
           foreignField: "_id",
           as: "movie"
       }
  }
]).limit(5).toArray( function(err, docs) {
  console.log(err);
  console.log("Found the following records");
  console.log(docs);
// perform actions on the collection object
client.close();
//moviesComents.forEach(itm => {console.log(itm)});
});
}
// client.close();

main().catch(console.error);

/*client.connect(err => {
    if (err) console.log(err);
  const collection = client.db("sample_training").collection("devices");
  collection.find().toArray(function(err, docs) {
    assert.equal(err, null);
    console.log("Found the following records");
    console.log(docs);
  // perform actions on the collection object
  client.close();
}
);
}
);
*/
