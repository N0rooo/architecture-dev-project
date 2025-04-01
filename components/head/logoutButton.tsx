"use client"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import React from "react"

export default function LogoutButton() {
	const router = useRouter()

	const logout = async () => {
		console.log("here")
		const response = await fetch("/api/auth/signout", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
		})
		if (response.ok) {
			router.push("/login")
		}
	}
	return <Button className="cursor-pointer" variant="outline" size="icon" onClick={logout}>
    <LogOut />
  </Button>
}
