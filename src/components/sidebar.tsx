import { Command, Inbox, Settings2, Tag } from "lucide-react"
import { Outlet, useNavigate } from "react-router-dom"

export const Sidebar = () => {
    const navigate = useNavigate();

    return (

        <div className="flex h-svh overflow-hidden text-left">
            <div className="h-svh border border-r-gray-100 flex p-3 flex-col items-center space-y-3 min-w-14">
                <div onClick={() => navigate('/')} className="text-white h-8 cursor-pointer w-8 bg-black p-2 rounded-md flex items-center justify-center">
                    <Command />
                </div>
                <div onClick={() => navigate('/dashboard')} className="h-8 w-8 hover:bg-gray-100 cursor-pointer p-2 rounded-md flex items-center justify-center">
                    <Inbox />
                </div>
                <div onClick={() => navigate('/tags')} className="h-8 w-8 hover:bg-gray-100 cursor-pointer p-2 rounded-md flex items-center justify-center">
                    <Tag />
                </div>
                <div onClick={() => navigate('/settings')} className="h-8 w-8 hover:bg-gray-100 cursor-pointer p-2 rounded-md flex items-center justify-center">
                    <Settings2 />
                </div>
            </div>
            <Outlet />
        </div>
    )
} 
