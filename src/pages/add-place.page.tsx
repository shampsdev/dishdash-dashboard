import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Place } from "@/interfaces/place.interface";
import { PlaceModule } from "@/modules/place.module";
import { parsePlace } from "@/shared/api/parse.api";
import React, { useState } from 'react';

export const AddPlacePage = () => {
    const [url, setUrl] = useState('');
    const [parsedPlace, setParsedPlace] = useState<Omit<Place, "id"> | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

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
        } catch (err) {
            setError('Failed to parse the place. Please check the URL or API key.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full m-5">
            <div className="w-full p-5 justify-center h-full flex">
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
                <div className="mt-5">
                    <h2 className="text-lg font-semibold">Parsed Place:</h2>
                    <PlaceModule inputPlace={{ ...parsedPlace, id: 0 }} />
                </div>
            )}
        </div>
    );
};

