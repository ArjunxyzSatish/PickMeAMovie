let express = require("express");
require('dotenv').config();
let path = require('path');
let app = express();
let port = process.env.PORT || 8080;
let bodyParser = require("body-parser");
const mongoose = require('mongoose');
const { Db } = require("mongodb");


app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true});

console.log('connected to db');

let commentSchema = new mongoose.Schema({
	author: String,
	dateCreated: Date,
	commentBody: String
})

let comment = mongoose.model('Comments', commentSchema);


app.use(express.static("public"));
app.set("view engine", "ejs");

app.set("views", path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

// Get req for the homepage
app.get("/", (req, res) => {
	res.render("homepage");
	console.log(req.ip);
});

// Get request for the comments page
app.get("/comments", (req, res) => {
	comment.find({}, (err, comments) => {
		if(err){
			console.log(err);
		}
		else{
			res.render('commentsPage', {comments: comments});
		}
	})
});

app.get('/download', (req, res) => {
	const file = path.join(__dirname, 'downloads', 'PickMeAMovie.apk');
	res.download(file);
})



// post req that gets made when a new comment is made
app.post("/comments", (req, res) => {

	let toAdd = createComment(req);
	saveComment(toAdd);
	res.redirect("comments");
});

app.get('/api/credentials', (req, res) => {
	res.json({
		api_key: process.env.API_KEY,
		token: process.env.TOKEN
	});
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(port, () => {
	console.log(`running on port ${ port }`);
});

function createComment(req){
	const newComment = new comment({
		author: req.body.author ,
		dateCreated: new Date(), 
		commentBody: req.body.comment 
	})

	return newComment;
}

function saveComment(commentToBeAdded){
	commentToBeAdded.save( (err, comment) => {
		if(err){
			console.log(err);
		}
		else{
			console.log(`Comment added at ${commentToBeAdded.dateCreated}. ID: ${commentToBeAdded._id}`);
		}
	}); 
}


