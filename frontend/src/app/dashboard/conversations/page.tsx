"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"

interface Conversation {
  id: string
  title: string
  status: string
  createdAt: string
  messageCount: number
}

const sampleData: Conversation[] = [
  {
    id: "1",
    title: "Product Inquiry",
    status: "active",
    createdAt: "2024-01-15",
    messageCount: 5,
  },
  {
    id: "2",
    title: "Support Request",
    status: "resolved",
    createdAt: "2024-01-14",
    messageCount: 8,
  },
  {
    id: "3",
    title: "Billing Question",
    status: "pending",
    createdAt: "2024-01-13",
    messageCount: 3,
  },
]

export default function ConversationsTable() {
  return (
    <div className="w-full p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Conversations</h1>
        <p className="text-muted-foreground">Manage your conversations</p>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Messages</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sampleData.map((conversation) => (
              <TableRow key={conversation.id}>
                <TableCell className="font-medium">{conversation.title}</TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      conversation.status === "active"
                        ? "bg-green-100 text-green-800"
                        : conversation.status === "resolved"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {conversation.status}
                  </span>
                </TableCell>
                <TableCell>{conversation.createdAt}</TableCell>
                <TableCell>{conversation.messageCount}</TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
