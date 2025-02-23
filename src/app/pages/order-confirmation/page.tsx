"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"
import Link from "next/link"
import { CheckCircle } from "lucide-react"
import { getOrderUseCase } from "@/use-cases/orderUseCases" // Assume this function exists to fetch order details
import type { OrderDetails } from "@/interfaces/interfaces" // Assume this type is defined

export default function OrderConfirmationPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const orderId = searchParams.get("orderId")
    if (!orderId) {
      setError("No order ID provided")
      setLoading(false)
      return
    }

    const fetchOrderDetails = async () => {
      try {
        const details = await getOrderUseCase(orderId)
        setOrderDetails(details)
      } catch (err) {
        setError("Failed to fetch order details")
      } finally {
        setLoading(false)
      }
    }

    fetchOrderDetails()
  }, [searchParams])

  if (loading) return <div className="container mx-auto max-w-3xl px-4 py-12">Loading...</div>
  if (error) return <div className="container mx-auto max-w-3xl px-4 py-12">Error: {error}</div>
  if (!orderDetails) return <div className="container mx-auto max-w-3xl px-4 py-12">No order details found</div>

  return (
    <div className="container mx-auto max-w-3xl px-4 py-12">
      <div className="text-center mb-8">
        <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
        <h1 className="mt-4 text-3xl font-bold">Заказ выполнен</h1>
        <p className="mt-2 text-muted-foreground">Спасибо за покупку!</p>
      </div>

      <div className="bg-muted p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Детали заказа</h2>
        <div className="grid gap-2">
          <div className="flex justify-between">
            <span>Номер заказа:</span>
            <span className="font-medium">{orderDetails._id?.toString()}</span>
          </div>
          <div className="flex justify-between">
            <span>Имя:</span>
            <span className="font-medium">{orderDetails.name}</span>
          </div>
          <div className="flex justify-between">
            <span>Метод доставки:</span>
            <span className="font-medium">{orderDetails.deliveryMethod === "pickup" ? "Самовывоз" : "Курьер"}</span>
          </div>
          <div className="flex justify-between">
            <span>Итого:</span>
            <span className="font-medium">{orderDetails.total.toFixed(2)} руб</span>
          </div>
        </div>
      </div>

      <Separator className="my-8" />

      <div>
        <h2 className="text-xl font-semibold mb-4">Cводка заказа</h2>
        {orderDetails.cartItems.map((item) => (
          <div key={item.productId} className="flex items-center py-4 space-x-4">
            <div className="flex-shrink-0">
              <Image
                src={item.image || "/placeholder.svg"}
                alt={item.name}
                width={64}
                height={64}
                className="rounded-md object-cover"
              />
            </div>
            <div className="flex-grow">
              <Link href={`/?id=${item.productId}`} className="text-blue-600 hover:underline">
                {item.name}
              </Link>
              <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
            </div>
            <div className="flex-shrink-0 font-medium">{(item.price * item.quantity).toFixed(2)} руб</div>
          </div>
        ))}
      </div>

      <Separator className="my-8" />

      <div className="flex justify-between items-center">
        <span className="text-lg font-semibold">Итого:</span>
        <span className="text-lg font-semibold">{orderDetails.total.toFixed(2)} руб</span>
      </div>

      <div className="mt-8 flex justify-center">
        <Button onClick={() => router.push("/")}>Продолжить покупки</Button>
      </div>
    </div>
  )
}

