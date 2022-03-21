var express = require('express');
var mysql = require('mysql2');
var router = express.Router();

//create db connection creds
var con = mysql.createConnection({
  host: "localhost",
  user: "poster",
  password: "password123", //would be nicer in real production :)
  database: "cs_webdev_final"
});

//MYSQL DATABASE FUNCTIONS
//post blogpost to db
function createBlogPost(formData, onFinish){
  var stmt = `INSERT INTO blog_posts (blog_title, blog_body) VALUES ('${formData.blog_title}','${formData.blog_body}')`;

  con.query(stmt, function (err, result) {
    if (err) throw err;
    console.log("1 record inserted");
    onFinish();
  });
}

//update blogpost in db
function updateBlogPost(formData,onFinish){
  var stmt = `UPDATE blog_posts SET blog_title = '${formData.blog_title}', blog_body = '${formData.blog_body}' WHERE id = ${formData.id}`;
  con.query(stmt, function (err, result) {
    if (err) throw err;
    console.log(result.affectedRows + " record(s) updated");
    onFinish();
  });
}

//drop blogpost from db
function deleteBlogPost(id, onFinish){
  var stmt = `DELETE FROM blog_posts WHERE id = ${id}`;
  con.query(stmt, function (err, result) {
    if (err) throw err;
    console.log(result);
    onFinish();
  }); 
}

function getBlogPost(id, onFinish){
  var stmt = `SELECT * FROM blog_posts WHERE id = ${id}`;

  con.query(stmt, function (err, result) {
    if (err) throw err;
    console.log(result);
    onFinish(result);
  }); 
}

function getAllBlogPosts(onFinish){
  var stmt = `SELECT * FROM blog_posts`;

  con.query(stmt, function (err, result, fields) {
    if (err) throw err;
    console.log(result);
    onFinish(result);
  }); 
}

//ROUTING FUNCTIONS
/* GET home page. */
router.get('/', function(req, res, next) {
  getAllBlogPosts((retVal)=>{
    res.render('home', { title: 'Home', blog_posts: retVal });
  });
});

/* GET home page. */
router.get('/home', function(req, res, next) {
  getAllBlogPosts((retVal)=>{
    res.render('home', { title: 'Home', blog_posts: retVal });
  });
});

/* GET edit page. */
router.post('/edit', function(req, res, next) {

  const entryToEdit = req.body;

  getBlogPost(entryToEdit.id,(postData)=>{  
    res.render('edit', 
          { title: 'Edit Post', 
          id: postData[0].id, 
          blog_title: postData[0].blog_title, 
          blog_body: postData[0].blog_body
        });});
});

/* GET deletion page. */
router.post('/delete', function(req, res, next) {

  const entryToDelete = req.body;

  getBlogPost(entryToDelete.id,(postData)=>{  
      res.render('delete', 
            { title: 'Delete Post', 
            id: postData[0].id, 
            blog_title: postData[0].blog_title, 
            blog_body: postData[0].blog_body
          });});
});

/* GET new post page. */
router.get('/new', function(req, res, next) {
  res.render('new', { title: 'New Post' });
});

//API FUNCTIONS
/* POST new blog entry.*/
router.post('/finish_post',function(req,res){
  const blog_entry = req.body;

  console.log(blog_entry);

  createBlogPost(blog_entry, ()=>{
    res.redirect(302, '/home');
  });
});

/* PUT edit blog entry.*/
router.post('/finish_edit',function(req,res){
  const blog_entry = req.body;

  console.log(blog_entry);

  updateBlogPost(blog_entry,()=>{
    res.redirect(302, '/home');
  });
});

/* DELETE blog entry.*/
router.post('/finish_delete',function(req,res){
  const blog_id = req.body.id;

  deleteBlogPost(blog_id,()=>{
    res.redirect(302, '/home');
  });
});



module.exports = router;
