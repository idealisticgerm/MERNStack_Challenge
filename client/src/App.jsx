import { Link, Routes, Route ,BrowserRouter as Router} from "react-router-dom";
import Transaction from "./pages/Transaction.jsx";
import Statistics from "./pages/Statistics.jsx";
import Navbar from "./components/Navbar.jsx";

function App() {
    return (
        <Router>
            <Navbar/>
        <Routes>
            <Route path="/" element={<Transaction />} />
            <Route path="/statistics" element={<Statistics />} />
        </Routes>
        </Router>
    );
}
export default App