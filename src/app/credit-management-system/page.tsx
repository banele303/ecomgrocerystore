import Image from "next/image"
import CreditCustomerManagement from "./CreditCustomerManagement"
import InvoicingSystem from "./InvoincingSystem"
import PaymentReminders from "./PaymentSystem"


export default function Component() {
  return (
    <div className="bg-black px-[2rem] py-5">
    <CreditCustomerManagement/>
    <div className="py-4"></div>
    <InvoicingSystem/>
    <div className="py-4"></div>
    <PaymentReminders/>
    <div className="py-4"></div>
    </div>
  )
}
