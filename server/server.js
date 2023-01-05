const express = require('express');
const mongoose = require('mongoose');
const {
	v4: uuidv4
} = require('uuid');
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 3000;
const mongoURI = process.env.MONGO_URI;
mongoose.set('strictQuery', false);
mongoose.connect(mongoURI, {
	useNewUrlParser: true,
	useUnifiedTopology: true
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => console.log('Connected to MongoDB'));
const app = express();
app.use(cors());
const userSchema = new mongoose.Schema({
	publicAddress: {
		type: String,
		required: true
	},
	nonce: {
		type: String,
		required: true
	},
});
const User = mongoose.model('User', userSchema);

function generateNonce(req,res,next) {
	req.nonce = uuidv4();
	next();
}
app.get('/login', generateNonce, (req, res) => {
	const publicAddress = req.query.publicAddress;
	User.findOne({
		publicAddress: publicAddress
	}, (err, user) => {
		if (err) {
			res.status(500).send(err);
			return;
		}
		if (user) {
			res.send({
				nonce: user.nonce
			});
		} else {
			const newUser = new User({
				publicAddress: publicAddress,
				nonce: req.nonce
			});
			newUser.save((err) => {
				if (err) {
					res.status(500).send(err);
					return;
				}
				res.send({
					nonce: newUser.nonce
				});
			});
		}
	});
});

function createJWT(publicAddress, nonce) {
	return jwt.sign({
		publicAddress: publicAddress,
		nonce: nonce
	}, process.env.JWT_SECRET, {
		expiresIn: '1d'
	});
}
app.post('/authenticate', (req, res) => {
	
	const publicAddress = req.body.publicAddress;
	const signature = req.body.signature;
	const nonce = req.body.nonce;
	User.findOne({
		publicAddress: publicAddress
	}, (err, user) => {
		if (err) {
			res.status(500).send(err);
			return;
		}
		if (!user) {
			res.status(401).send('User not found');
			return;
		}
		if (user.nonce !== nonce) {
			res.status(401).send('Invalid nonce');
			return;
		}
		const message = `${publicAddress}:${nonce}`;
		const web3 = new Web3();
		const isValid = web3.eth.accounts.recover(message, signature);
		if (isValid !== publicAddress) {
			res.status(401).send('Invalid signature');
			return;
		}
		const token = createJWT(publicAddress, nonce);
		res.send({
			token: token
		});
	});
});
app.listen(port, () => console.log(`Listening on port ${port}`));