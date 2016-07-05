/*
 * 
 * brand API
 */

//include module Bjson
var bson = require('bson');
/*
 * Serve JSON to our AngularJS client
 */

exports.name = function (req, res) {
    res.json({
        name: 'Bob'
    });
};

//////////////////////////////////// Users ////////////////////////////////////////

/*
 * get users list
 */
exports.add_brand = function (req, res) {
  //create db instance !! 
  var db = req.db;
  
  //inster user data
    db.collection('brand').insert(req.body, {w: 1}, function (err, result) {
        if (err)
            throw err;
        res.json(result);
    }); 
  res.status(200);
}

/* 
 * Name : all_user
 * Method : GET
 * show all users
 */
exports.all_brand = function (req, res) {
  var db = req.db;
  db.collection('brand').find().toArray(function (err, result) {
    if (err)
        throw err;
    res.json(result);
  });
}

/* Name : view user
 * Method : GET
 * view User
 * show specific user by user ID
 */
exports.view_brand = function (req, res) {
//create db instance !!
    var db = req.db;
    db.collection('brand').find({"_id": new bson.ObjectID(req.params.id)}).toArray(function (err, result) {
        if (err)
            throw err; 
        res.json(result); 
    });
}

/* @Name : update_user
 * @Method : PUT
 * @Update user
 * @param : {}
 * update user by user ID
 * db.getCollection('products').update({"_id" : ObjectId("569f88f31f3dfa03244f9b5d")},{$set:{"title":"Sumit"}})
 */
exports.update_brand = function (req, res) {
     var db = req.db;
     db.collection('brand').update({"_id" : new bson.ObjectID(req.body._id)},{$set:req.body.data},function (err, result) {
            if (err)
                throw err;
            res.json(result);
        }); 
    res.status(200);
}

/*
 * Nmae : Delelete user
 * Methode : Delete
 * Description : Delete user by user id 
 */
exports.delete_brand = function(req, res){ 
   // res.send(req.body._id);
    
    var db= req.db;
    db.collection('brand').remove({"_id" : new bson.ObjectID(req.body._id)},function (error, result){
       res.json({'message' : 'brand hass been deleted','status': true , 'result' : result}); 
    })
}

exports.get_brands = function (req, res) {
  var db = req.db;
  db.collection('brand').find().toArray(function (err, result) {
    if (err)
        throw err;
    res.json(result);
  });
}


