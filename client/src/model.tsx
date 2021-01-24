import React from "react";
import { useState } from 'react';
import Modal from "react-bootstrap/Modal";
import "bootstrap/dist/css/bootstrap.min.css";
import {createApiClient, Ticket} from './api';
const api = createApiClient();


interface Props {
  ticket: Ticket;
}

var tickCount = 0;

const Model = ({ticket}: Props) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [title, setTitle] = React.useState("Transitioning...");
    const [formData, setFormData] = useState({email: "", password: ""})
    const [message, setMessage] = React.useState("null");

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
       setFormData({...formData, [e.target.name]: e.target.value})
       setMessage(e.target.value)
    }


    const sendEmailed = async () => {
      hideModal();

      console.log(ticket.userEmail, ticket.title, message);
      {ticket.status='done'}
      await api.sendEmail(message, ticket.userEmail, ticket.title, ticket.id)
    }

  
    const showModal = () => {
      setIsOpen(true);
      setTitle("Modal Ready");
      document.body.style.backgroundColor = "#f5f9fc";
    };
  
    const hideModal = () => {
      setIsOpen(false);
    };
  
  
    const onExit = () => {
      setTitle("Goodbye 😀");
    };
  
    const onExited = () => {
      document.body.style.backgroundColor = "#f5f9fc";
    };
  
    return (
      <>
      {ticket.status?(
        <button className="done">Ticket Closed</button>
      ):(
        <button className="modaling" onClick={showModal}>Respond To Ticket</button>
      )}
        <form >
        <Modal
          show={isOpen}
          onHide={hideModal}
          onExit={onExit}
          onExited={onExited}
          translate="yes"
        >
          <Modal.Body>
          <div className="form-group">
            <label><b>User Email Address</b></label>
            <input type="email" className="form-control" id="exampleFormControlInput1" placeholder={ticket.userEmail}></input>
            <label className="subject"><b>Subject</b></label>
            <p><b>Response To:</b> {ticket.title}</p>
          </div>
          <div className="form-group">
            <label>Response</label>
            <textarea className="form-control" id='email' name="email" onChange={handleChange}></textarea>
          </div>
          
          </Modal.Body>

          <Modal.Footer>
            <button className="cancel" onClick={hideModal}>Cancel</button>
            <button className="send" type="submit" onClick={sendEmailed}>Send</button>
          </Modal.Footer>
        </Modal>
        </form>
      </>
    );
  };

  export default Model