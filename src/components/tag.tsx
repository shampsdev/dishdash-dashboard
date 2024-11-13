import { Tag } from "@/interfaces/place.interface"

export const TagComponent = ({ tag, onClick }: { tag: Tag, onClick?: () => void }) => {
    return <div onClick={onClick} className="flex text-sm rounded-full cursor-pointer border w-fit px-2 py-1">
        <img className="w-auto h-[20px] mr-2" src={tag.icon} />
        <p className="pr-2">
            {tag.name}
        </p>
    </div>
}
