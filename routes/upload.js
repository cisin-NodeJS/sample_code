/*
 * 
 * Upload file API
 */

//include module Bjson
var bson = require('bson');
var multer = require('multer');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        console.log(file.mimetype);
        var fileExt = file.mimetype;
        var data = fileExt.split('/');
        cb(null, Date.now() + '.' + data[1]) //Appending .jpg
    }
})
var upload = multer({storage: storage})

/*
 * Serve JSON to our AngularJS client
 */

exports.name = function (req, res) {
    res.json({
        name: 'Bob'
    });
};

//////////////////////////////////// Upload file ////////////////////////////////////////

/*
 * @Name : Upload single file
 * @Method : uploadSingleFile
 * @Param : {image:FILE}
 * @return :  image details
 * Description : this function upload only single file
 */
exports.uploadSingleFile = function (req, res) {
    console.log('i am calling');
    console.log(req.body); // form fields
    console.log(req.file); // form files
    res.send(req.file);
    res.status(204).end();
}

/*
 * @Name : Upload multi file
 * @Method : uploadSingleFile
 * @Param : {image:FILE}
 * @return :  image details
 * Description : this function upload only single file
 */
exports.uploadMultipleFile = function (req, res) {
    console.log('i am calling');
    console.log(req.body); // form fields
    console.log(req.files); // form files
    res.json(req.files);
    res.status(204).end();
}