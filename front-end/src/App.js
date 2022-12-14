import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  // setup state
  const [tickets, setTickets] = useState([]);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [problem, setProblem] = useState("");
  const [type, setType] = useState("");

  const fetchTickets = async() => {
    try {      
      const response = await axios.get("/api/tickets");
      setTickets(response.data.tickets);
    } catch(error) {
      setError("error retrieving words: " + error);
    }
  }
  const createTicket = async() => {
    try {
      await axios.post("/api/tickets", {name: name, problem: problem, type: type});
    } catch(error) {
      setError("error adding a word: " + error);
    }
  }
  const deleteOneTicket = async(ticket) => {
    try {
      await axios.delete("/api/tickets/" + ticket.id);
    } catch(error) {
      setError("error deleting a word" + error);
    }
  }

  // fetch ticket data
  useEffect(() => {
    fetchTickets();
  },[]);

  const addTicket = async(e) => {
    e.preventDefault();
    await createTicket();
    fetchTickets();
    setName("");
    setProblem("");
    setType("");
  }

  const deleteTicket = async(ticket) => {
    await deleteOneTicket(ticket);
    fetchTickets();
  }

  // render results
  return (
    <div className="App">
      <h1>Build Your Own Dictionary</h1>
      {error}
      <form onSubmit={addTicket}>
        <div>
          <label>
            Word:&nbsp;
            <input type="text" value={name} onChange={e => setName(e.target.value)} />
          </label>
        </div>
        <div>
          <label>
            Type (eg noun, verb, adjective, etc.):&nbsp;
            <input type="text" value={type} onChange={e => setType(e.target.value)} />
          </label>
        </div>
        <div>
          <label>
            Definition:&nbsp;
            <textarea value={problem} onChange={e=>setProblem(e.target.value)}></textarea>
          </label>
        </div>
        <input class="in" type="submit" value="Create your word" />
      </form>
      <h2>Vocabulary</h2>
      <div class="flex-container">
        {tickets.map( ticket => (
          <div key={ticket.id} className="ticket">
            <div className="problem">
              <p><strong>{ticket.name}</strong>&nbsp;<i>({ticket.type})</i></p>
              <p>{ticket.problem}</p>
            </div>
            <button onClick={e => deleteTicket(ticket)}>Remove this word</button>
          </div>
        ))}
      </div>
      <div id="space"></div>
    </div>
  );
}

export default App;