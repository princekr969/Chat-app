"use client"
import { useRouter } from "next/navigation";
import { useState } from "react";


export default function Home() { 
  const [slug, setSlug] = useState("");
  const router = useRouter();

  return (
    <div >
     <input value={slug} onChange={(e) => setSlug(e.target.value)} type="text" placeholder="Room Id" name="" id="" />
      <button onClick={() => router.push(`/room/${slug}`)}>Join Room</button>
    </div>
  );
}
