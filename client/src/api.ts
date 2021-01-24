import axios from 'axios';

export type Ticket = {
	id: string,
	title: string;
	content: string;
	creationTime: number;
	userEmail: string;
	labels?: string[];
	status?: string;
}

export type ApiClient = {
	getTickets: (pageNumber: number, searchTerm: string) => Promise<Ticket[]>;
	sendEmail: (email: string, title: string, messege: string, id: string) => Promise<void>;
	getFilteredTicket: (pageNumber: number, hiddenTickets : string) => Promise<Ticket[]>;
}



export const createApiClient = (): ApiClient => {
	return {
		getTickets: (pageNumber: number,searchTerm: string) => {
			return axios.get(`http://localhost:3232/api/tickets?page=${pageNumber}${searchTerm !== ''?`&search=${searchTerm}`:''}`).then((res) => res.data);
		},
		sendEmail: (messege: string, email: string, title: string, id: string) => {
			return axios.post(`http://localhost:3232/api/form`,{messege: messege, email: email, title: title, id: id})
		},
		getFilteredTicket: (pageNumber: number, hiddenTickets : string) => {
			return axios.get(`http://localhost:3232/api/filtered?page=${pageNumber}&hidden=${hiddenTickets}`).then((res) => res.data)
		}
	}
}



