import express from 'express';

import bodyParser = require('body-parser');
import { tempData } from './temp-data';
import { Ticket } from '@ans-exam/client/src/api';
const nodemailer  = require('nodemailer')
const app = express();

const PORT = 3232;

const PAGE_SIZE = 20;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))


app.use((_, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', '*');
	res.setHeader('Access-Control-Allow-Headers', '*');
	next();
});

app.get('/api/filtered', (req, res) => {
	console.log("Connected Successfully")
	const page = req.query.page || 1;
	const hide = req.query.hidden;
	console.log(hide)
	let paginatedData = undefined;
	const filteredTickets = tempData.filter((t) => !hide.includes(t.id));

	paginatedData = filteredTickets.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
	res.send(paginatedData);

})

app.get('/api/tickets', (req, res) => {

	function filterContent (searchTerm: string){
		filteredTickets = filteredTickets.filter( t => (t.title.toLowerCase() + t.content.toLowerCase()).includes(searchTerm.toLowerCase()))
	}

	const page = req.query.page || 1;

	const searched = req.query.search;
	var filteredTickets = tempData;
	let paginatedData = filteredTickets;
	
	if(searched){
		var searchTerm = searched
		if(searched.includes(":")){
			var beforeAfter = new Date(searched.split(":")[1].split(" ")[0].replace("/","-"))			
			switch(searched.split(":")[0].toLowerCase()) { 
				case "from": { 
					searchTerm = ""
					filteredTickets = tempData.filter((t) => (t.userEmail.toLowerCase()).includes(searched.split(":")[1].toLowerCase()));
				   break; 
				} 
				case "before": {
					filteredTickets = tempData.filter((t) => (t.creationTime<beforeAfter.getTime()))
					searchTerm = searched.split(":")[1].split(" ")[1]
				    break; 
				}
				case "after": {
					filteredTickets = tempData.filter((t) => (t.creationTime>beforeAfter.getTime()))
					searchTerm = searched.split(":")[1].split(" ")[1]
					break; 
				}
				default: 
				   break; 
			 } 
		}
		if(searchTerm){
			filterContent(searchTerm)
		}
	} 
	paginatedData = filteredTickets.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
	res.send(paginatedData);
});

app.post('/api/form', (req, res) => {
    async function main() {
		let transporter = nodemailer.createTransport({
		  host: "smtp.ethereal.email",
		  port: 587,
		  secure: false, // true for 465, false for other ports
		  auth: {
			user: 'kieran.hermann10@ethereal.email',
			pass: 'dv9pzntUDs54K716Px',
		  },
		});

		let info = await transporter.sendMail({
		  from: 'kieran.hermann10@ethereal.email', 
		  to: 'kieran.hermann10@ethereal.email', 
		  subject: req.body.title, 
		  text: req.body.messege, 
		  html: `<p>${req.body.messege}</p>`, 
		});
		console.log("Message sent: %s", info.messageId);
		console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
	  }
	   main().catch(console.error);
		const filteredTickets = tempData.find((t) => (t.id.toLowerCase()===req.body.id));
		if(filteredTickets){
			filteredTickets.status="closed";
		}

})


app.listen(PORT);
console.log('server running', PORT)

