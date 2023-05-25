import { Shell, ShellRef } from "@/components/Shell";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import useSWR from "swr";

export default function Page() {
  const router = useRouter();
  const user = useUser();
  const supabase = useSupabaseClient();
  const [message, setMessage] = useState("");
  const shell = useRef<ShellRef>(null);
  const input = useRef<HTMLInputElement>(null);
  const { data: messages } = useSWR<{ id: number; message: string; created_at: string }[]>(
    "/api/messages",
    (url) => fetch(url).then((res) => res.json()),
    {
      refreshInterval: 1000,
    }
  );
  const [lastSeenId, setLastSeenId] = useState(-1);

  useEffect(() => {
    console.log("User", user, "messages", messages);
    if (lastSeenId !== -1 && messages) {
      const n = messages.filter((m) => m.id > lastSeenId);
      if (n.length > 0) {
        shell?.current?.showMessage("New messages: " + n.map((m) => m.message).join(", "));
      }
    }
    setLastSeenId(messages ? messages[messages.length - 1]?.id : -1);
  }, [user, messages]);

  const sendMessage = async (msg: string) => {
    const { data, error } = await supabase
      .from("messages")
      .insert([{ message: msg, user_id: user?.id }])
      .select("*");
    if (error) {
      shell?.current?.showError(error.message);
      console.error("Error sending message", error);
    } else {
      shell?.current?.showMessage("Added " + data[0]?.id);
      console.log("Message sent", data);
    }
  };

  return (
    <Shell className="flex flex-col gap-2 items-center" ref={shell}>
      <div>Hello, {user?.email}</div>
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Enter message.."
          ref={input}
          onChange={(e) => setMessage(e.target.value)}
          value={message}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded placeholder:text-gray-300"
        />

        <button
          disabled={!message}
          onClick={() => {
            sendMessage(message);
            setMessage("");
            input.current?.focus();
          }}
          className="bg-blue-500 disabled:hover:bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:text-gray-300"
        >
          Send
        </button>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => router.push("/api/auth/signOut?redirectTo=/")}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Sign Out
        </button>
      </div>
    </Shell>
  );
}
