import { Tag } from "@/interfaces/place.interface";
import { useEffect, useState } from "react";
import { fetchTags } from "@/api/tags.api";
import { Plus, X } from "lucide-react";

export const TagsPage = () => {
    const [tags, setTags] = useState<Tag[]>([]);

    useEffect(() => {
        fetchTags().then((x) => {
            if (x) setTags(x);
        });
    }, []);

    return (
        <div className="w-full h-full flex">
            <div className="flex pt-5 flex-col space-y-5 w-[300px] border-gray-100 border-r">
                {tags.map((tag) => (
                    <div className="group cursor-pointer flex gap-5 hover:bg-gray-100 mx-5 items-center py-2 px-4 rounded-full border">
                        <div className="w-[30px]">
                            <img className="w-full h-full object-cover" src={tag.icon} />
                        </div>
                        <p>{tag.name}</p>
                        <div className="group-hover:flex ml-auto text-gray-300 hidden items-center justify-center p-1 rounded-md">
                            <X className="h-[20px]" />
                        </div>
                    </div>
                ))}
                <div className="cursor-pointer flex items-center justify-center text-gray-300 hover:bg-gray-100 mx-5 py-2 px-6 rounded-full border">
                    <Plus />
                </div>
            </div>
        </div>
    )
}
