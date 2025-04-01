"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User } from "@/types/types"
import { RefreshCcw, UserPlus, Users } from "lucide-react"
import React, { useEffect, useState } from "react"

const initialUser: User = {
	id: "",
	name: "",
	email: "",
	avatar: "",
	address: "",
	phone: "",
	company: "",
	created_at: "",
}

export default function HomeView() {
	const [users, setUsers] = useState<User[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [isDialogOpen, setIsDialogOpen] = useState(false)
	const [newUser, setNewUser] = useState<User>(initialUser)

	const handleGetUsers = async () => {
		try {
			setIsLoading(true)
			setError(null)
			const res = await fetch("/api/users")

			if (!res.ok) {
				throw new Error(`Failed to fetch users: ${res.status}`)
			}

			const data = await res.json()
			setUsers(data)
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to fetch users")
		} finally {
			setIsLoading(false)
		}
	}

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target
		setNewUser((prev) => {
			return {
				...prev,
				[name]: value,
			}
		})
	}

	const handleCreateUser = async () => {
		setIsLoading(true)
		try {
			const res = await fetch("/api/users", {
				method: "POST",
				body: JSON.stringify({ user: newUser }),
			})

			if (!res.ok) {
				throw new Error(`Failed to create user: ${res.status}`)
			}

			const data = await res.json()
			console.log("Created user:", data)
			setUsers([...users, data])
			setIsDialogOpen(false)
		} catch (err) {
			console.error(err)
		} finally {
			setIsLoading(false)
		}
	}

	const resetUsers = () => {
		setUsers([])
		setError(null)
	}

	useEffect(() => {
		handleGetUsers()
	}, [])

	return (
		<div className="container py-10 max-w-4xl mx-auto">
			<Card>
				<CardHeader className="border-b">
					<CardTitle className="text-2xl flex items-center gap-2">
						<Users className="h-5 w-5" />
						User Management
					</CardTitle>
				</CardHeader>
				<CardContent className="p-6">
					<div className="flex gap-4 mb-6">
						<Button onClick={handleGetUsers} disabled={isLoading} className="gap-2">
							{isLoading ? "Loading..." : "Get Users"}
						</Button>
						<Button onClick={resetUsers} variant="outline" className="gap-2">
							<RefreshCcw className="h-4 w-4" />
							Set to null
						</Button>
					</div>

					<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
						<DialogTrigger asChild>
							<Button className="gap-2 mb-6">
								<UserPlus className="h-4 w-4" />
								Create User
							</Button>
						</DialogTrigger>
						<DialogContent className="sm:max-w-[425px]">
							<DialogHeader>
								<DialogTitle>Create New User</DialogTitle>
							</DialogHeader>
							<div className="grid gap-4 py-4">
								<div className="grid gap-2">
									<Label htmlFor="name">Name (required)</Label>
									<Input id="name" name="name" value={newUser.name} onChange={handleInputChange} placeholder="John Doe" />
								</div>
								<div className="grid gap-2">
									<Label htmlFor="email">Email (required)</Label>
									<Input id="email" name="email" type="email" value={newUser.email} onChange={handleInputChange} placeholder="john@example.com" />
								</div>
								<div className="grid gap-2">
									<Label htmlFor="avatar">Avatar URL</Label>
									<Input id="avatar" name="avatar" value={newUser.avatar} onChange={handleInputChange} placeholder="https://example.com/avatar.jpg" />
								</div>
								<div className="grid gap-2">
									<Label htmlFor="address">Address</Label>
									<Input id="address" name="address" value={newUser.address} onChange={handleInputChange} placeholder="123 Main St, City, Country" />
								</div>
								<div className="grid gap-2">
									<Label htmlFor="phone">Phone</Label>
									<Input id="phone" name="phone" value={newUser.phone} onChange={handleInputChange} placeholder="+1 234 567 8900" />
								</div>
								<div className="grid gap-2">
									<Label htmlFor="company">Company</Label>
									<Input id="company" name="company" value={newUser.company} onChange={handleInputChange} placeholder="Acme Inc." />
								</div>
							</div>
							<div className="flex justify-end gap-3">
								<Button variant="outline" onClick={() => setIsDialogOpen(false)}>
									Cancel
								</Button>
								<Button onClick={handleCreateUser} disabled={isLoading || !newUser.name || !newUser.email}>
									{isLoading ? "Creating..." : "Create User"}
								</Button>
							</div>
						</DialogContent>
					</Dialog>

					{error && <div className="bg-destructive/10 text-destructive p-3 rounded-md mb-4">{error}</div>}

					{users.length > 0 ? (
						<div className="space-y-4">
							<h2 className="text-lg font-medium">Users ({users.length})</h2>
							<div className="border rounded-md overflow-hidden">
								<div className="overflow-x-auto">
									<table className="w-full whitespace-nowrap">
										<thead className="bg-muted">
											<tr>
												{Object.keys(users[0]).map((key) => (
													<th key={key} className="text-left p-3 font-medium">
														{key.charAt(0).toUpperCase() + key.slice(1)}
													</th>
												))}
											</tr>
										</thead>
										<tbody>
											{users.map((user, index) => (
												<tr key={index} className="border-t">
													{Object.values(user).map((value, i) => (
														<td key={i} className="p-3">
															{typeof value === "object" && value !== null ? (
																<div className="max-w-xs overflow-hidden text-ellipsis">
																	<details className="cursor-pointer">
																		<summary className="text-sm text-primary">View Object</summary>
																		<pre className="mt-2 p-2 bg-muted rounded-md text-xs overflow-x-auto max-h-40">{JSON.stringify(value, null, 2)}</pre>
																	</details>
																</div>
															) : (
																String(value)
															)}
														</td>
													))}
												</tr>
											))}
										</tbody>
									</table>
								</div>
							</div>
						</div>
					) : isLoading ? (
						<div className="text-center py-10 text-muted-foreground">Loading...</div>
					) : (
						<div className="text-center py-10 text-muted-foreground">No users to display. Click "Get Users" to fetch data.</div>
					)}
				</CardContent>
			</Card>
		</div>
	)
}
