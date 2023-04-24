import { BrowserRouter as Router,Routes, Route } from "react-router-dom";
import Album from "./pages/Album";
import Room from "./pages/Room";

function App() {
  return (
        <div className="app">
           <Router>
            <Routes>
              <Route path="/" element={<Album />} />
              <Route path="/room" element={<Room />} />
            </Routes> 
          </Router> 
        </div>  
  );
}

export default App;