"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/app/_components/ui/button";
import { Input } from "@/app/_components/ui/input";
import Link from "next/link";
import Image from "next/image";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push("/admin/panel");
      } else {
        setError(data.message || "Erro ao logar");
      }
    } catch (err) {
      setError("Erro na requisição");
    }
  };

  return (
    <div className="flex flex-col gap-8 min-h-screen items-center justify-center bg-gray-50">
      <div>
        <Link href="/">
          <Image src="/logo.svg" alt="Barber" width={219} height={30} />
        </Link>
      </div>

      <div className="flex flex-col gap-4 w-full max-w-sm p-6 bg-white rounded-xl shadow">
        <h1 className="text-2xl font-bold mb-4">Login admin</h1>

        <div className="flex flex-col">
          <Input
            placeholder="Username"
            value={username}
            required
            onChange={(e) => setUsername(e.target.value)}
            className="mb-2 border-border rounded-full py-5"
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
            className="mb-2 border-border rounded-full py-5"
          />
        </div>

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <Button onClick={handleLogin} className="w-full rounded-full cursor-pointer">Login</Button>
      </div>
    </div>
  );
}
