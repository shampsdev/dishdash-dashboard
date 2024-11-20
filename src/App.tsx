import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import 'leaflet/dist/leaflet.css';
import { Sidebar } from './components/sidebar';
import { TagsPage } from './pages/tags.page';
import { MapPage } from './pages/map.page';
import { Toaster } from 'react-hot-toast';
import { SettingsPage } from './pages/settings.page';
import DashboardSidebar from './modules/dashboard-sidebar.module';
import { DashboardPage } from './pages/dashboard.page';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AddPlacePage } from './pages/add-place.page';


const queryClient = new QueryClient();

function App() {

    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <Routes>
                    <Route path={"/"} element={<Sidebar />} >
                        <Route path="dashboard" element={<DashboardSidebar />} >
                            <Route path=":id" element={<DashboardPage />} />
                        </Route>
                        <Route path="tags" element={<TagsPage />} />
                        <Route path="map" element={<MapPage />} />
                        <Route path="add-place" element={<AddPlacePage />} />
                        <Route path="settings" element={<SettingsPage />} />
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
        </QueryClientProvider>
    );
}

export default App;
