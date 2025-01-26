"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "@/hooks/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, UserPlus, DollarSign, CreditCard } from "lucide-react"

type CreditCustomer = {
  id: string
  name: string
  email: string
  creditLimit: number
  balance: number
}

export default function CreditCustomerManagement() {
  const [customers, setCustomers] = useState<CreditCustomer[]>([])
  const [newCustomer, setNewCustomer] = useState({ name: "", email: "", creditLimit: 0 })
  const [searchTerm, setSearchTerm] = useState("")

  const addCustomer = async () => {
    if (!newCustomer.name || !newCustomer.email || newCustomer.creditLimit <= 0) {
      toast({
        title: "Invalid Input",
        description: "Please fill in all fields with valid information.",
        variant: "destructive",
      })
      return
    }

    const customer: CreditCustomer = {
      id: Date.now().toString(),
      ...newCustomer,
      balance: 0,
    }
    setCustomers([...customers, customer])
    setNewCustomer({ name: "", email: "", creditLimit: 0 })
    toast({
      title: "Customer Added",
      description: `${customer.name} has been added to the credit customers list.`,
    })
  }

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Credit Customer Management</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="add" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="add">Add Customer</TabsTrigger>
            <TabsTrigger value="view">View Customers</TabsTrigger>
          </TabsList>
          <TabsContent value="add">
            <div className="space-y-4 mt-4">
              <Input
                placeholder="Name"
                value={newCustomer.name}
                onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                className="w-full"
              />
              <Input
                placeholder="Email"
                value={newCustomer.email}
                onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                className="w-full"
              />
              <div className="flex items-center space-x-2">
                R
                <Input
                  type="number"
                  placeholder="Credit Limit"
                  value={newCustomer.creditLimit}
                  onChange={(e) => setNewCustomer({ ...newCustomer, creditLimit: Number(e.target.value) })}
                  className="w-full"
                />
              </div>
              <Button onClick={addCustomer} className="w-full">
                <UserPlus className="mr-2 h-4 w-4" /> Add Customer
              </Button>
            </div>
          </TabsContent>
          <TabsContent value="view">
            <div className="space-y-4 mt-4">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search customers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              <ScrollArea className="h-[400px] w-full rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[180px]">Name</TableHead>
                      <TableHead className="hidden md:table-cell">Email</TableHead>
                      <TableHead>Credit Limit</TableHead>
                      <TableHead>Balance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCustomers.map((customer) => (
                      <TableRow key={customer.id}>
                        <TableCell className="font-medium">{customer.name}</TableCell>
                        <TableCell className="hidden md:table-cell">{customer.email}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <CreditCard className="mr-2 h-4 w-4 text-muted-foreground" />
                            {customer.creditLimit.toFixed(2)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                      R{customer.balance.toFixed(2)}
                          </div>
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

