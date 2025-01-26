"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { format, parseISO, isAfter } from "date-fns"
import { Search, Send, AlertTriangle } from "lucide-react"

type Reminder = {
  id: string
  customerName: string
  amount: number
  dueDate: string
  status: "Pending" | "Sent" | "Overdue"
}

export default function PaymentReminders() {
  const [reminders, setReminders] = useState<Reminder[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    // In a real app, this would fetch reminders from a database
    const mockReminders: Reminder[] = [
      { id: "1", customerName: "John Doe", amount: 100, dueDate: "2023-07-01", status: "Pending" },
      { id: "2", customerName: "Jane Smith", amount: 200, dueDate: "2023-07-05", status: "Pending" },
      { id: "3", customerName: "Alice Johnson", amount: 150, dueDate: "2023-06-30", status: "Overdue" },
      { id: "4", customerName: "Bob Brown", amount: 300, dueDate: "2023-07-10", status: "Pending" },
    ]
    setReminders(mockReminders)
  }, [])

  const sendReminder = async (id: string) => {
    // In a real app, this would send an email and update the database
    setReminders(reminders.map((reminder) => (reminder.id === id ? { ...reminder, status: "Sent" } : reminder)))
    toast({
      title: "Reminder Sent",
      description: `Payment reminder has been sent to the customer.`,
    })
  }

  const filteredReminders = reminders.filter(
    (reminder) =>
      reminder.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reminder.amount.toString().includes(searchTerm) ||
      reminder.dueDate.includes(searchTerm),
  )

  const getStatusColor = (status: Reminder["status"], dueDate: string) => {
    if (status === "Sent") return "bg-green-100 text-green-800"
    if (status === "Overdue" || isAfter(new Date(), parseISO(dueDate))) return "bg-red-100 text-red-800"
    return "bg-yellow-100 text-yellow-800"
  }

  const ReminderTable = ({ reminders }: { reminders: Reminder[] }) => (
    <ScrollArea className="h-[400px] w-full rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Customer</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead className="hidden md:table-cell">Due Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reminders.map((reminder) => (
            <TableRow key={reminder.id}>
              <TableCell className="font-medium">{reminder.customerName}</TableCell>
              <TableCell>R{reminder.amount.toFixed(2)}</TableCell>
              <TableCell className="hidden md:table-cell">{format(parseISO(reminder.dueDate), "PPP")}</TableCell>
              <TableCell>
                <Badge variant="outline" className={getStatusColor(reminder.status, reminder.dueDate)}>
                  {reminder.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button
                  onClick={() => sendReminder(reminder.id)}
                  disabled={reminder.status === "Sent"}
                  size="sm"
                  variant="outline"
                >
                  <Send className="mr-2 h-4 w-4" />
                  Send
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
  )

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Payment Reminders</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All Reminders</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="overdue">Overdue</TabsTrigger>
          </TabsList>
          <div className="my-4 relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search reminders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <TabsContent value="all">
            <ReminderTable reminders={filteredReminders} />
          </TabsContent>
          <TabsContent value="pending">
            <ReminderTable reminders={filteredReminders.filter((r) => r.status === "Pending")} />
          </TabsContent>
          <TabsContent value="overdue">
            <ReminderTable
              reminders={filteredReminders.filter(
                (r) => r.status === "Overdue" || isAfter(new Date(), parseISO(r.dueDate)),
              )}
            />
          </TabsContent>
        </Tabs>
        {filteredReminders.some((r) => r.status === "Overdue" || isAfter(new Date(), parseISO(r.dueDate))) && (
          <div className="mt-4 p-4 bg-red-100 text-red-800 rounded-md flex items-center">
            <AlertTriangle className="mr-2 h-5 w-5" />
            <span>There are overdue payments. Please take action.</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

