import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Place } from "@/interfaces/place.interface";
import { PlaceModule } from "@/modules/place.module";
import { parsePlace } from "@/shared/api/parse.api";
import { usePlaces } from "@/shared/hooks/usePlaces";
import React, { useState } from 'react';
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export const AddPlacePage = () => {
    const [url, setUrl] = useState('');
    const [parsedPlace, setParsedPlace] = useState<Omit<Place, "id"> | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const { savePlace } = usePlaces();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUrl(e.target.value);
    };

    const handleParse = async () => {
        setError('');
        if (!url) {
            setError('URL cannot be empty.');
            return;
        }

        try {
            setLoading(true);
            const place = await parsePlace(url);
            setParsedPlace(place);
        } catch {
            setError('Failed to parse the place. Please check the URL or API key.');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (place: Place) => {
        const newPlace = await savePlace.mutateAsync(place);
        navigate(`/dashboard/${newPlace.id}`);
        toast.success("Place updated");
    }

    return (
        <div className="w-full h-full overflow-y-scroll m-5 flex flex-col pb-10">
            <div className="w-full p-5 justify-center flex">
                <div className="flex gap-4">
                    <Input
                        value={url}
                        onChange={handleInputChange}
                        placeholder="Enter the URL..."
                    />
                    <Button variant="outline" onClick={handleParse} disabled={loading}>
                        {loading ? 'Parsing...' : 'Parse URL'}
                    </Button>
                </div>
            </div>

            {error && <p className="text-red-500 text-center mt-2">{error}</p>}

            {parsedPlace && (
                <PlaceModule
                    inputPlace={{ ...parsedPlace, id: 0 }}
                    onSave={handleSave}
                />
            )}
        </div>
    );
};

