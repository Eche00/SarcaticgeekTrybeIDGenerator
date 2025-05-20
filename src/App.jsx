import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import IDCardPage from "./IDCardPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="generator/:id" element={<IDCardPage />} />
      </Routes>
    </Router>
  );
}

export default App;
