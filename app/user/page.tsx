"use client"

import { useEffect, useState } from "react";
import { getCurrentUserAPI } from "@/lib/api/auth";
import { getRelationshipsAPI } from "@/lib/api/relationships";
import { getUsersAPI } from "@/lib/api/users";
import { User } from "@/lib/types";
import type { Relationship } from "@/lib/types";
import { TypesOfRelationships } from "@/lib/types";
import { PersonIcon } from "@radix-ui/react-icons";


export default function UserPage(){
    const [user, setUser] = useState<User | null>(null);
    const [relationships, setRelationShips] = useState<Relationship[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(()=>{
        async function loadUserData(){
            setIsLoading(true);

            const [userData, userRelationships, usersData] = await
            Promise.all([
                getCurrentUserAPI(),
                getRelationshipsAPI(),
                getUsersAPI(),
            ])

            setUser(userData ?? null)
        }
        loadUserData();
    },[])

    return(
        <div className="max-w-2xl mx-auto p-6 space-y-8">
            <section className="bg-white border border-gray-200 overflow-hidden">
                <div className="p-6 flex items-center gap-4">
                    <div className="w-16 h-16  bg-gray-200 flex items-center justify-center flex-shrink-0">
                        <PersonIcon className="w-8 h-8 text-gray-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h1 className = "text-xl font-semibold text-gray-900 truncate">
                            {user?.username}
                        </h1>
                        <p className="text-gray-600 truncate">
                            {user?.email}
                        </p>
                    </div>
                </div>
            </section>
            <section>
                
            </section>
        </div>
    )
}