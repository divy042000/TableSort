import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ReportFrameworkPage from './Pages/reportFrameworkPage.jsx';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/report" element={<ReportFrameworkPage />} />
      </Routes>
    </Router>
  );
}

export default App;