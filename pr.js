const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const URI = "mongodb+srv://admin:admin@cluster0.curam.mongodb.net/sample_training?retryWrites=true&w=majority";

async function printDatabases(client){
    databasesList = await client.db().admin().listDatabases();
    console.log("Databases:");
    databasesList.databases.forEach(db => console.log(` - ${db.name}`));
}
async function connect(uri){
  const client = new MongoClient(uri, { useNewUrlParser: true , useUnifiedTopology: true , connectTimeoutMS: 30000 , keepAlive: 1} );
  
  await client.connect().then( (data) => { console.log("Connected")}, (err) => { console.log(err)} );
  return client;
}

async function getFilmsComments(client){

  return client.db("sample_mflix").collection("comments").aggregate([
    {
       $lookup:
          {
             from: "movies",
             localField: "movie_id",
             foreignField: "_id",
             as: "movie"
         }
    }
  ]).limit(5).toArray( );
}

async function getUsersWithEquipment(client){

  return client.db("time_man").collection("users").aggregate([
    {
       $lookup:
          {
             from: "equipment",
             localField: "actions.equipment.ref",
             foreignField: "_id",
             as: "equipment"
         }
    }
  ]).limit(5).toArray( );
}

async function main(){

  const client = await connect(URI);
  
  const user =  await getUsersWithEquipment(client);
  console.log(user);

  const dbs = await printDatabases(client);
  console.log(dbs);


  const films = await getFilmsComments(client);
  console.log(films);


 client.close();

}


main().catch(console.error);

