import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import { Sidebar } from './components/sidebar';
import Dashboard from './pages/dashboard.page';
import { TagsPage } from './pages/tags.page';

function App() {

    return (
        <BrowserRouter>
            <Routes>
                <Route path={"/"} element={<Sidebar />} >
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="tags" element={<TagsPage />} />
                    <Route path="settings" element={<></>} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
