const mongoose = require('mongoose');

const uri = "mongodb://tarun1:tarun7204@ac-y7s9jm5-shard-00-00.8gyh1ur.mongodb.net:27017,ac-y7s9jm5-shard-00-01.8gyh1ur.mongodb.net:27017,ac-y7s9jm5-shard-00-02.8gyh1ur.mongodb.net:27017/?ssl=true&replicaSet=atlas-13c54d-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0";
// Wait, the replicaSet name might be wrong, let's try the direct SRV string first but with a different Node.js option, or just see if the direct string fails with auth error (which means connection succeeded)

mongoose.connect("mongodb+srv://tarun1:tarun7204@cluster0.8gyh1ur.mongodb.net/?appName=Cluster0")
  .then(() => console.log("Connected using SRV!"))
  .catch(err => {
    console.error("SRV connection failed:", err.message);
    
    // try direct
    const directUri = "mongodb://tarun1:tarun7204@ac-y7s9jm5-shard-00-00.8gyh1ur.mongodb.net:27017,ac-y7s9jm5-shard-00-01.8gyh1ur.mongodb.net:27017,ac-y7s9jm5-shard-00-02.8gyh1ur.mongodb.net:27017/?ssl=true&authSource=admin&retryWrites=true&w=majority&appName=Cluster0";
    console.log("Trying direct URI...");
    mongoose.connect(directUri)
      .then(() => console.log("Connected using direct URI!"))
      .catch(err2 => console.error("Direct connection failed:", err2.message))
      .finally(() => process.exit(0));
  });
