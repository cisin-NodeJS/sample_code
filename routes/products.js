/*
 * 
 * Product API
 */

//include module Bjson
var bson = require('bson'), multer = require('multer')
upload = multer({dest: 'uploads/'});
/*
 * Serve JSON to our AngularJS client
 */

exports.name = function (req, res) {
    res.json({
        name: 'Bob'
    });
};

//////////////////////////////////// Product ////////////////////////////////////////

/*
 * @Name : AddProduct
 * @Method : POST
 * @Param : {title:string,desctiption:string,status:boolean,}
 * @return : 
 * Description : 
 */
exports.add_product = function (req, res) {
    //create db instance !! 
    var db = req.db;

    //inster user data
    db.collection('products').insert(req.body, {w: 1}, function (err, result) {
        if (err)
            throw err;
        res.json(result);
    });
    res.status(200);
}

/* 
 * Name : all_products
 * Method : GET
 * show all Products
 */
exports.all_product = function (req, res) {
    var db = req.db;
    db.collection('products').find().toArray(function (err, result) {
        if (err)
            throw err;
        res.json(result);
    });
}
// exports.type_for = function (req, res) {
//     var db = req.db;
//     // console.log(req.for)
//     db.collection('products').distinct('for').toArray(function (err, result) {
//         if (err)
//             throw err;
//         res.json(result);
//     });
// }

/* Name : view product
 * Method : GET
 * view Product
 * show specific Product by Product ID
 */
exports.view_product = function (req, res) {
//create db instance !!
    var db = req.db;
    db.collection('products').find({_id: new bson.ObjectID(req.params.id)}).toArray(function (err, result) {
        if (err)
            throw err;
         //set category
         var cat='',__result={},__result2={};
         if(result[0].hasOwnProperty('category')){
             catID =result[0].category;
         }
           if(result[0].hasOwnProperty('subcategory')){
              catID =result[0].subcategory;
         }
         
         __result = result;
        db.collection('category').find({"_id": new bson.ObjectID(catID)}).toArray(function (err, catResult) {
            if (err)
                throw err;
            __result2 = catResult;
            result[0].cat = catResult[0];
        });
        var finalObj = __result.concat(__result2);
        res.json(finalObj);
    });
}
/* @Name : update_user
 * @Method : PUT
 * @Update user
 * @param : {}
 * update user by user ID
 * db.getCollection('products').update({"_id" : ObjectId("569f88f31f3dfa03244f9b5d")},{$set:{"title":"Sumit"}})
 */
exports.update_product = function (req, res) {
    var db = req.db;
    db.collection('products').update({"_id": new bson.ObjectID(req.body._id)}, {$set: req.body.data}, function (err, result) {
        if (err)
            throw err;
        res.json(result);
    });
    res.status(200);
}
/*
 * Nmae : Delelete Product
 * Methode : Delete
 * Description : Delete product by product id 
 */
exports.delete_product = function (req, res) {
    // res.send(req.body._id);
    var db = req.db;
    db.collection('products').remove({"_id": new bson.ObjectID(req.body._id)}, function (error, result) {
        res.json({'message': 'Product hass been deleted', 'status': true, 'result': result});
    })
}
/*
 * test
 */
exports.test = function (req, res, next) {
    //res.send(req.file);
    console.log(req.file);
    // req.file is the `avatar` file
    // req.body will hold the text fields, if there were any
    res.json({'message': 'Product hass been deleteddd', 'status': true, 'data': req.file});
}

/* Name : GET product BY CAT ID
 * Method : GET
 * get Product by category ID
 * show specific Product by Cat ID
 */
exports.getProductByCategory = function (req, res) {
//create db instance !!
    var db = req.db;
    db.collection('products').find({category: req.params.id}).toArray(function (err, result) {
        if (err)
            throw err;
        res.json(result);
    });
}