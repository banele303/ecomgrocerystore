"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { CalendarIcon, DollarSign, Search, UserPlus } from "lucide-react"

type Invoice = {
  id: string
  customerName: string
  amount: number
  dueDate: Date
  status: "Pending" | "Paid" | "Overdue"
}

export default function InvoicingSystem() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [newInvoice, setNewInvoice] = useState({ customerName: "", amount: 0, dueDate: new Date() })
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()

  const createInvoice = async () => {
    if (!newInvoice.customerName || newInvoice.amount <= 0) {
      toast({
        title: "Invalid Input",
        description: "Please fill in all fields with valid information.",
        variant: "destructive",
      })
      return
    }

    const invoice: Invoice = {
      id: Date.now().toString(),
      ...newInvoice,
      status: "Pending",
    }
    setInvoices([...invoices, invoice])
    setNewInvoice({ customerName: "", amount: 0, dueDate: new Date() })
    toast({
      title: "Invoice Created",
      description: `Invoice for ${invoice.customerName} has been created.`,
    })
  }

  const updateInvoiceStatus = (id: string, newStatus: Invoice["status"]) => {
    setInvoices(invoices.map((invoice) => (invoice.id === id ? { ...invoice, status: newStatus } : invoice)))
    toast({
      title: "Invoice Updated",
      description: `Invoice status has been updated to ${newStatus}.`,
    })
  }

  const filteredInvoices = invoices.filter(
    (invoice) =>
      invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.amount.toString().includes(searchTerm) ||
      format(invoice.dueDate, "PPP").toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Invoicing System</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="create" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="create">Create Invoice</TabsTrigger>
            <TabsTrigger value="view">View Invoices</TabsTrigger>
          </TabsList>
          <TabsContent value="create">
            <div className="space-y-4 mt-4">
              <Input
                placeholder="Customer Name"
                value={newInvoice.customerName}
                onChange={(e) => setNewInvoice({ ...newInvoice, customerName: e.target.value })}
                className="w-full"
              />
              <div className="flex items-center space-x-2">
                <DollarSign className="text-muted-foreground" />
                <Input
                  type="number"
                  placeholder="Amount"
                  value={newInvoice.amount || ""}
                  onChange={(e) => setNewInvoice({ ...newInvoice, amount: Number(e.target.value) })}
                  className="w-full"
                />
              </div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !newInvoice.dueDate && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {newInvoice.dueDate ? format(newInvoice.dueDate, "PPP") : <span>Pick a due date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={newInvoice.dueDate}
                    onSelect={(date) => date && setNewInvoice({ ...newInvoice, dueDate: date })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <Button onClick={createInvoice} className="w-full">
                <UserPlus className="mr-2 h-4 w-4" /> Create Invoice
              </Button>
            </div>
          </TabsContent>
          <TabsContent value="view">
            <div className="space-y-4 mt-4">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search invoices..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              <ScrollArea className="h-[400px] w-full rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[180px]">Customer</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead className="hidden md:table-cell">Due Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInvoices.map((invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell className="font-medium">{invoice.customerName}</TableCell>
                        <TableCell>${invoice.amount.toFixed(2)}</TableCell>
                        <TableCell className="hidden md:table-cell">{format(invoice.dueDate, "PPP")}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              invoice.status === "Paid"
                                ? "outline"
                                : invoice.status === "Overdue"
                                  ? "destructive"
                                  : "default"
                            }
                            className={cn(
                              invoice.status === "Paid" && "bg-green-100 text-green-800 hover:bg-green-100",
                              invoice.status === "Overdue" && "bg-red-100 text-red-800 hover:bg-red-100",
                            )}
                          >
                            {invoice.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {invoice.status === "Pending" && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateInvoiceStatus(invoice.id, "Paid")}
                                className="mr-2"
                              >
                                Mark Paid
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateInvoiceStatus(invoice.id, "Overdue")}
                              >
                                Mark Overdue
                              </Button>
                            </>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

