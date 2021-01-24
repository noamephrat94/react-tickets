import React from 'react';
import './App.scss';
import {createApiClient, Ticket} from './api';
import { Component, MouseEvent, useState } from 'react';
import SmartText from './smartText';
import Model from './model';


export type AppState = {
	tickets?: Ticket[],
	search: string;
	currentPage: number;
	noMore: boolean;
}

const api = createApiClient();
var counter = 1;
var hidden : string[] = [];


export class App extends React.PureComponent<{}, AppState> {

	state: AppState = {
		search: '',
		currentPage:1,
		noMore: false,
	}

	searchDebounce: any = null;

	async componentDidMount() {
		this.setState({
			tickets: await api.getTickets(this.state.currentPage, '')
		});
	}

	
	splitLabels(labels? : string[]){
		if (labels){
			return(
				<ul>
					{labels.map((value, index) => {
						return <li className='labels' key={index}>{value}</li>
					})}
				</ul>
			)
		}
	}

	handleDelete = async (id:string) => {
		let ticket = this.state.tickets!.find(ticket => {
			return ticket.id === id
		})
		hidden.push(ticket!.id)
		if(hidden){
			this.setState({
				tickets: await api.getFilteredTicket(this.state.currentPage, JSON.stringify(hidden))
			});
		}
		// let tickets = this.state.tickets!.filter(ticket =>{
		// 	return ticket.id !== id
		// });
		// this.setState({
		// 	tickets: tickets
		// })
		counter++;
		if (counter !== 0){
			const elm = document.querySelector<HTMLElement>('.test')!;
			elm.style.display = 'inline';
		}
	}

	handleRestore = () => {
		hidden = [];
		this.componentDidMount()
		const elm = document.querySelector<HTMLElement>('.test')!;
		counter = 1;
		if (counter === 1){
			elm.style.display = 'none';
		}
	}

	private handleSubmit = async (
		e: React.FormEvent<HTMLFormElement>
	  ): Promise<void> => {
		e.preventDefault();
	  }

	renderTickets = (tickets: Ticket[]) => {

		const filteredTickets = tickets

		return (<ul className='tickets'>
			{filteredTickets.map((ticket) => (<li key={ticket.id} className='ticket'>
            <div className='titles'>
                <button className="hide" onClick={() => {this.handleDelete(ticket.id)}}>Hide</button>
                <div><h5 className='title'>{ticket.title}</h5></div>
            </div>
				<p className='content'><SmartText text={ticket.content} length={300} /></p>
				<footer>
					<div className='meta-data'>By {ticket.userEmail} | { new Date(ticket.creationTime).toLocaleString()}
					< Model ticket={ticket}/>
                    </div>
					{this.splitLabels(ticket.labels)}
				</footer>
			</li>
			))}
			
		</ul>);
	}


	onSearch = async (val: string, newPage?: number) => {
		
		clearTimeout(this.searchDebounce);

		this.searchDebounce = setTimeout(async () => {
			var amount = api.getTickets(1, val);
			if ((await amount).length < 20){
				this.setState({
					search: val,
					noMore: true,
					tickets: await api.getTickets(1, val) 
				})
			}
			else{
				this.setState({
					search: val,
					noMore: false,
					tickets: await api.getTickets(1, val) 
			})};
		}, 300);
	}


	showMore = async () => {
		var newTickets = await api.getTickets(this.state.currentPage + 1, this.state.search)
		if(newTickets.length > 0){
			this.setState({
				tickets:[...this.state.tickets!,...newTickets],
				currentPage: this.state.currentPage +1
			})
		} else {
			this.setState({
				noMore: true
			})
		}
	}

	render() {	
		const {tickets} = this.state;
		

		return (<main>
			
			<h1>Tickets List</h1>
			<header>
				<input type="search" placeholder="Search..." onChange={(e) => this.onSearch(e.target.value)}/>
			</header>
			{tickets ? <div className='results'>Showing {tickets.length} results  <p className="test">( {counter} hidden ticket -<button className="restoreBtn" onClick={this.handleRestore} >restore </button>)</p> </div> : null  }
			<div className="maybe"></div>	
			{tickets ? this.renderTickets(tickets) : <h2>Loading..</h2>}
			{!this.state.noMore && (
				<div className="buttoncont"><button className="showmore" onClick={() => this.showMore()}>Show More</button></div>
			)}
		</main>)
				
	}
}

export default App;