import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import 'leaflet/dist/leaflet.css';
import { Sidebar } from './components/sidebar';
import Dashboard from './pages/dashboard.page';
import { TagsPage } from './pages/tags.page';
import { MapPage } from './pages/map.page';
import { PlaceModule } from './components/place.module';
import { Toaster } from 'react-hot-toast';

function App() {

    return (
        <BrowserRouter>
            <Routes>
                <Route path={"/"} element={<Sidebar />} >
                    <Route path="dashboard" element={<Dashboard />} >
                        <Route path=":id" element={<PlaceModule />} />
                    </Route>
                    <Route path="tags" element={<TagsPage />} />
                    <Route path="map" element={<MapPage />} />
                    <Route path="settings" element={<></>} />
                </Route>
            </Routes>
            <Toaster toastOptions={{
                position: 'top-right',
                className: '',
                style: {
                    color: 'black',
                    padding: '5px',
                    boxShadow: 'none',
                    border: '1px solid #f3f4f6',
                    fontSize: '15px'
                },
                icon: null,
                iconTheme: {
                    primary: 'black',
                    secondary: 'white'
                }
            }} />
        </BrowserRouter>
    );
}

export default App;
