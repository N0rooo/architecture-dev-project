"use client"
import { Button } from "@/components/ui/button"
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
	return <Button className="cursor-pointer" onClick={logout}>Logout</Button>
}
