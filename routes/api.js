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
exports.add_user = function (req, res) {
    //create db instance !! 
    var db = req.db;
    
    //inster user data
        db.collection('users').insert(req.body, {w: 1}, function (err, result) {
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
exports.all_user = function (req, res) {
    var db = req.db;
    db.collection('users').find().toArray(function (err, result) {
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
exports.view_user = function (req, res) {
//create db instance !!
    var db = req.db;
    db.collection('users').find({_id: new bson.ObjectID(req.params.id)}).toArray(function (err, result) {
        if (err)
            throw err; 
        res.json(result); 
    });
}
/* Name : update_user
 * Method : PUT
 * Update user
 * update user by user ID
 */
exports.update_user = function (req, res) {
    res.send(req.body);
}
/*
 * Nmae : Delelete user
 * Methode : Delete
 * Description : Delete user by user id 
 */
exports.delete_user = function(req, res){ 
   // res.send(req.body._id);
    var db= req.db;
    db.collection('users').remove({"_id" : new bson.ObjectID(req.body._id)},function(error, result){
       res.json({'message' : 'User hass been deleted','status': true , 'result' : result}); 
    })
    }