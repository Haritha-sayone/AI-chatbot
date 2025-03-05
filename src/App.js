import './App.css';
import Chatbot from './components/Chatbot';
import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <div className="App">
      <ToastContainer />
      <Chatbot />    
    </div>
  );
}

export default App;
