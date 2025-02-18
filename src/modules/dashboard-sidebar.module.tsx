import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Outlet, useNavigate } from 'react-router-dom';
import { usePlaces } from '@/shared/hooks/usePlaces';

export default function DashboardSidebar() {
    const { data: places } = usePlaces();
    const [filter, setFilter] = useState('');

    const navigate = useNavigate();

    const filteredPlaces = places?.filter((place) =>
        place.title.toLowerCase().includes(filter.toLowerCase())
    );

    return (
        <div className="w-full h-full flex">
            <div className="flex flex-col w-[350px] border-gray-100 border-r">
                <div className="p-5 pt-4 space-y-5 border-gray-100 border-b">
                    <h1 className="text-xl">All Places</h1>
                    <Input
                        placeholder="Filter places..."
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    />
                </div>
                <div className='h-full divide-gray-100 w-full overflow-y-scroll no-scrollbar'>
                    {filteredPlaces?.map((x, index) => (
                        <div key={`${x.id}_${index}`} onClick={() => {
                            navigate(`${x.id}`);
                        }} className="cursor-pointer px-3 py-2 h-24 hover:bg-gray-100 w-full">
                            <p>
                                {x.title} <span className="text-muted-foreground text-xs">{x.id}</span>
                            </p>
                            <p className="text-muted-foreground line-clamp-2 text-sm">
                                {x.address}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
            <div className="w-full m-5">
                <Outlet />
            </div>
        </div>
    );
}
