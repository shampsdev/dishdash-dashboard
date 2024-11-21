import { usePlaces } from '@/shared/hooks/usePlaces';
import { MapContainer, Marker, Popup, TileLayer, ZoomControl } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';

export const MapPage = () => {
    const { data: places } = usePlaces();

    const naviagte = useNavigate();

    return (
        <div className="w-full h-full flex">
            <MapContainer
                attributionControl={false}
                zoomControl={false}
                center={[59.95725, 30.30826]}
                zoom={13}
            >
                <TileLayer
                    url="https://api.mapbox.com/styles/v1/mapbox/light-v11/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWlrZWRlZ2VvZnJveSIsImEiOiJja3ZiOGQwc3I0N29uMnVxd2xlbGVyZGQzIn0.11XK5mqIzfLBTfNTYOGDgw"
                />
                {places?.map((place) => (
                    <Marker position={[place.location.lat, place.location.lon]}>
                        <Popup>
                            {place.title}
                            <div className="cursor-pointer" onClick={() => naviagte(`/dashboard/${place.id}`)}>
                                Открыть место
                            </div>
                        </Popup>
                    </Marker>
                ))}
                <ZoomControl position='bottomright' />
            </MapContainer>
        </div>
    )
}
