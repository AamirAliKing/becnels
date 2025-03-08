"use client"

import { useState, useEffect, useRef } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Bell, Calendar, ChevronLeft, MessageCircle, Paperclip, Search, Send, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserButton, useUser } from "@clerk/nextjs"


type Message = {
  id: string
  sender: string
  avatar: string
  content: string
  timestamp: string
  isRead: boolean
  isUser?: boolean
}

type Conversation = {
  id: string
  contact: string
  avatar: string
  lastMessage: string
  timestamp: string
  unread: number
  department: string
  messages: Message[]
}

export default function MessagesPage() {
  const searchParams = useSearchParams()
  const conversationId = searchParams.get("conversation")
  const processedConversationRef = useRef<string | null>(null)

  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: "1",
      contact: "Service Advisor",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: "Your car is ready for pickup. Please let us know when you'll be coming in.",
      timestamp: "2 hours ago",
      unread: 2,
      department: "Service",
      messages: [
        {
          id: "m1",
          sender: "Service Advisor",
          avatar: "/placeholder.svg?height=40&width=40",
          content: "Hello Mr. Smith, your BMW X5 has been checked in for the brake service.",
          timestamp: "Yesterday, 9:30 AM",
          isRead: true,
        },
        {
          id: "m2",
          sender: "John Smith",
          avatar: "/placeholder.svg?height=40&width=40",
          content: "Great, thank you. How long do you think it will take?",
          timestamp: "Yesterday, 10:15 AM",
          isRead: true,
          isUser: true,
        },
        {
          id: "m3",
          sender: "Service Advisor",
          avatar: "/placeholder.svg?height=40&width=40",
          content: "We should have it completed by tomorrow afternoon. We'll need to order a part for the rear brakes.",
          timestamp: "Yesterday, 10:30 AM",
          isRead: true,
        },
        {
          id: "m4",
          sender: "John Smith",
          avatar: "/placeholder.svg?height=40&width=40",
          content: "That works for me. Please let me know when it's ready.",
          timestamp: "Yesterday, 11:00 AM",
          isRead: true,
          isUser: true,
        },
        {
          id: "m5",
          sender: "Service Advisor",
          avatar: "/placeholder.svg?height=40&width=40",
          content: "Your car is ready for pickup. Please let us know when you'll be coming in.",
          timestamp: "2 hours ago",
          isRead: false,
        },
      ],
    },
    {
      id: "2",
      contact: "Parts Department",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: "Parts have arrived for your scheduled maintenance next week.",
      timestamp: "Yesterday",
      unread: 1,
      department: "Parts",
      messages: [
        {
          id: "m1",
          sender: "Parts Department",
          avatar: "/placeholder.svg?height=40&width=40",
          content: "We've ordered the parts for your upcoming maintenance service.",
          timestamp: "3 days ago",
          isRead: true,
        },
        {
          id: "m2",
          sender: "John Smith",
          avatar: "/placeholder.svg?height=40&width=40",
          content: "Thank you. When do you expect them to arrive?",
          timestamp: "3 days ago",
          isRead: true,
          isUser: true,
        },
        {
          id: "m3",
          sender: "Parts Department",
          avatar: "/placeholder.svg?height=40&width=40",
          content: "They should be here by the end of the week.",
          timestamp: "3 days ago",
          isRead: true,
        },
        {
          id: "m4",
          sender: "Parts Department",
          avatar: "/placeholder.svg?height=40&width=40",
          content: "Parts have arrived for your scheduled maintenance next week.",
          timestamp: "Yesterday",
          isRead: false,
        },
      ],
    },
    {
      id: "3",
      contact: "Mike Thompson",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: "I've completed the oil change service on your vehicle.",
      timestamp: "2 days ago",
      unread: 0,
      department: "Technician",
      messages: [
        {
          id: "m1",
          sender: "Mike Thompson",
          avatar: "/placeholder.svg?height=40&width=40",
          content: "I'll be working on your vehicle today for the oil change service.",
          timestamp: "2 days ago, 8:30 AM",
          isRead: true,
        },
        {
          id: "m2",
          sender: "John Smith",
          avatar: "/placeholder.svg?height=40&width=40",
          content: "Thanks Mike. Please let me know if you notice any other issues.",
          timestamp: "2 days ago, 9:00 AM",
          isRead: true,
          isUser: true,
        },
        {
          id: "m3",
          sender: "Mike Thompson",
          avatar: "/placeholder.svg?height=40&width=40",
          content:
            "I've completed the oil change service on your vehicle. Everything looks good, but I noticed your air filter will need replacement soon.",
          timestamp: "2 days ago, 11:45 AM",
          isRead: true,
        },
      ],
    },
  ])

  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [newMessage, setNewMessage] = useState("")

  // Initialize the selected conversation on first render
  useEffect(() => {
    // Set default selected conversation if none is specified
    if (!conversationId && conversations.length > 0) {
      setSelectedConversation(conversations[0])
    }
  }, [conversationId, conversations.length, conversations[0]]) // Added dependencies

  // Handle conversation selection from URL parameter
  useEffect(() => {
    if (conversationId && conversationId !== processedConversationRef.current) {
      const conversation = conversations.find((c) => c.id === conversationId)
      if (conversation) {
        setSelectedConversation(conversation)

        // Only mark as read if there are unread messages
        if (conversation.unread > 0) {
          const updatedConversations = conversations.map((conv) => {
            if (conv.id === conversationId) {
              const updatedMessages = conv.messages.map((msg) => ({
                ...msg,
                isRead: true,
              }))
              return {
                ...conv,
                unread: 0,
                messages: updatedMessages,
              }
            }
            return conv
          })

          setConversations(updatedConversations)
        }

        // Update the ref to prevent processing the same ID multiple times
        processedConversationRef.current = conversationId
      }
    }
  }, [conversationId, conversations]) // Added conversations dependency

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return

    const updatedMessage: Message = {
      id: `new-${Date.now()}`,
      sender: "John Smith",
      avatar: "/placeholder.svg?height=40&width=40",
      content: newMessage,
      timestamp: "Just now",
      isRead: true,
      isUser: true,
    }

    const updatedConversations = conversations.map((conv) => {
      if (conv.id === selectedConversation.id) {
        return {
          ...conv,
          lastMessage: newMessage,
          timestamp: "Just now",
          messages: [...conv.messages, updatedMessage],
        }
      }
      return conv
    })

    setConversations(updatedConversations)
    setSelectedConversation((prev) => {
      if (!prev) return null
      return {
        ...prev,
        lastMessage: newMessage,
        timestamp: "Just now",
        messages: [...prev.messages, updatedMessage],
      }
    })
    setNewMessage("")
  }

  const markConversationAsRead = (conversationId: string) => {
    // Check if the conversation has unread messages before updating
    const conversation = conversations.find((c) => c.id === conversationId)
    if (!conversation || conversation.unread === 0) {
      setSelectedConversation(conversation || null)
      return
    }

    const updatedConversations = conversations.map((conv) => {
      if (conv.id === conversationId) {
        const updatedMessages = conv.messages.map((msg) => ({
          ...msg,
          isRead: true,
        }))
        return {
          ...conv,
          unread: 0,
          messages: updatedMessages,
        }
      }
      return conv
    })

    setConversations(updatedConversations)
    const selected = updatedConversations.find((c) => c.id === conversationId) || null
    setSelectedConversation(selected)
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
      <img src="/logo.png" className="w-14 font-bold text-blue-600"></img>
      <h1 className="text-xl font-bold text-blue-600 ml-6">Becnels Automotive, LLC</h1>
      </div>
          <nav className="hidden md:flex items-center space-x-8">
            <a href="/" className="font-medium">
              Dashboard
            </a>
            <Link
              href="/messages"
              className="font-medium text-gray-900 border-b-2 border-blue-600 pb-1"
            >
              Messages
            </Link>
            <Link
              href="/vehicles"
              className="font-medium text-gray-500 hover:text-gray-900 hover:border-b-2 hover:border-blue-600 pb-1 transition-all"
            >
              My Vehicle
            </Link>
            <a
              href="#"
              className="font-medium text-gray-500 hover:text-gray-900 hover:border-b-2 hover:border-blue-600 pb-1 transition-all"
            >
              Repairs
            </a>
          </nav>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
            </Button>
            <UserButton afterSignOutUrl="/sign-in" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Mobile Back Button */}
          <div className="md:hidden mb-4">
            {selectedConversation && (
              <Button
                variant="outline"
                size="sm"
                className="flex items-center"
                onClick={() => setSelectedConversation(null)}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back to conversations
              </Button>
            )}
          </div>

          {/* Conversations List - Hidden on mobile when conversation is selected */}
          <div className={`w-full md:w-1/3 ${selectedConversation ? "hidden md:block" : "block"}`}>
            <Card>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <CardTitle>Messages</CardTitle>
                  <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                    {conversations.reduce((acc, conv) => acc + conv.unread, 0)} New
                  </Badge>
                </div>
                <div className="relative mt-2">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                  <Input placeholder="Search messages..." className="pl-8" />
                </div>
              </CardHeader>
              <Tabs defaultValue="all">
                <div className="px-6">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="unread">Unread</TabsTrigger>
                    <TabsTrigger value="service">Service</TabsTrigger>
                  </TabsList>
                </div>
                <TabsContent value="all" className="m-0">
                  <CardContent className="p-0">
                    <div className="divide-y">
                      {conversations.map((conversation) => (
                        <div
                          key={conversation.id}
                          className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${conversation.unread > 0 ? "bg-blue-50 hover:bg-blue-50/80" : ""}`}
                          onClick={() => markConversationAsRead(conversation.id)}
                        >
                          <div className="flex items-start">
                            <Avatar className="h-10 w-10 mr-3 border border-gray-200">
                              <AvatarImage src={conversation.avatar} alt={conversation.contact} />
                              <AvatarFallback>{conversation.contact.substring(0, 2)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-baseline">
                                <h4 className="font-medium truncate">{conversation.contact}</h4>
                                <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                                  {conversation.timestamp}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 truncate">{conversation.lastMessage}</p>
                              <div className="flex items-center mt-1">
                                <Badge variant="outline" className="text-xs px-2 py-0 h-5">
                                  {conversation.department}
                                </Badge>
                                {conversation.unread > 0 && (
                                  <Badge className="ml-2 bg-blue-500 text-white hover:bg-blue-600 text-xs px-2 py-0 h-5">
                                    {conversation.unread} new
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </TabsContent>
                <TabsContent value="unread" className="m-0">
                  <CardContent className="p-0">
                    <div className="divide-y">
                      {conversations
                        .filter((c) => c.unread > 0)
                        .map((conversation) => (
                          <div
                            key={conversation.id}
                            className="p-4 bg-blue-50 hover:bg-blue-50/80 cursor-pointer transition-colors"
                            onClick={() => markConversationAsRead(conversation.id)}
                          >
                            <div className="flex items-start">
                              <Avatar className="h-10 w-10 mr-3 border border-gray-200">
                                <AvatarImage src={conversation.avatar} alt={conversation.contact} />
                                <AvatarFallback>{conversation.contact.substring(0, 2)}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-baseline">
                                  <h4 className="font-medium truncate">{conversation.contact}</h4>
                                  <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                                    {conversation.timestamp}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-600 truncate">{conversation.lastMessage}</p>
                                <div className="flex items-center mt-1">
                                  <Badge variant="outline" className="text-xs px-2 py-0 h-5">
                                    {conversation.department}
                                  </Badge>
                                  <Badge className="ml-2 bg-blue-500 text-white hover:bg-blue-600 text-xs px-2 py-0 h-5">
                                    {conversation.unread} new
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </TabsContent>
                <TabsContent value="service" className="m-0">
                  <CardContent className="p-0">
                    <div className="divide-y">
                      {conversations
                        .filter((c) => c.department === "Service")
                        .map((conversation) => (
                          <div
                            key={conversation.id}
                            className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${conversation.unread > 0 ? "bg-blue-50 hover:bg-blue-50/80" : ""}`}
                            onClick={() => markConversationAsRead(conversation.id)}
                          >
                            <div className="flex items-start">
                              <Avatar className="h-10 w-10 mr-3 border border-gray-200">
                                <AvatarImage src={conversation.avatar} alt={conversation.contact} />
                                <AvatarFallback>{conversation.contact.substring(0, 2)}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-baseline">
                                  <h4 className="font-medium truncate">{conversation.contact}</h4>
                                  <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                                    {conversation.timestamp}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-600 truncate">{conversation.lastMessage}</p>
                                <div className="flex items-center mt-1">
                                  <Badge variant="outline" className="text-xs px-2 py-0 h-5">
                                    {conversation.department}
                                  </Badge>
                                  {conversation.unread > 0 && (
                                    <Badge className="ml-2 bg-blue-500 text-white hover:bg-blue-600 text-xs px-2 py-0 h-5">
                                      {conversation.unread} new
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </TabsContent>
              </Tabs>
            </Card>
          </div>

          {/* Conversation Detail - Hidden on mobile when no conversation is selected */}
          <div className={`w-full md:w-2/3 ${!selectedConversation ? "hidden md:block" : "block"}`}>
            {selectedConversation ? (
              <Card className="h-full flex flex-col">
                <CardHeader className="pb-3 border-b">
                  <div className="flex items-center">
                    <Avatar className="h-10 w-10 mr-3 border border-gray-200">
                      <AvatarImage src={selectedConversation.avatar} alt={selectedConversation.contact} />
                      <AvatarFallback>{selectedConversation.contact.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{selectedConversation.contact}</CardTitle>
                      <Badge variant="outline" className="mt-1">
                        {selectedConversation.department}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 overflow-y-auto p-0">
                  <div className="p-4 space-y-4">
                    {selectedConversation.messages.map((message) => (
                      <div key={message.id} className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}>
                        <div
                          className={`max-w-[80%] rounded-lg p-3 ${
                            message.isUser
                              ? "bg-blue-600 text-white rounded-br-none"
                              : "bg-gray-100 text-gray-800 rounded-bl-none"
                          }`}
                        >
                          <div className="flex items-start">
                            {!message.isUser && (
                              <Avatar className="h-8 w-8 mr-2">
                                <AvatarImage src={message.avatar} alt={message.sender} />
                                <AvatarFallback>{message.sender.substring(0, 2)}</AvatarFallback>
                              </Avatar>
                            )}
                            <div>
                              {!message.isUser && <p className="text-xs font-medium mb-1">{message.sender}</p>}
                              <p className="text-sm">{message.content}</p>
                              <p className={`text-xs mt-1 ${message.isUser ? "text-blue-200" : "text-gray-500"}`}>
                                {message.timestamp}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <div className="p-4 border-t">
                  <div className="flex items-end gap-2">
                    <Button variant="outline" size="icon" className="rounded-full h-10 w-10 flex-shrink-0">
                      <Paperclip className="h-5 w-5" />
                    </Button>
                    <div className="flex-1 relative">
                      <Input
                        placeholder="Type your message..."
                        className="pr-12 py-6"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault()
                            handleSendMessage()
                          }
                        }}
                      />
                      <Button
                        className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full h-8 w-8 p-0"
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim()}
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ) : (
              <Card className="h-full flex flex-col justify-center items-center p-8 text-center">
                <MessageCircle className="h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-xl font-medium text-gray-700 mb-2">No Conversation Selected</h3>
                <p className="text-gray-500 mb-6">Select a conversation from the list to view messages</p>
                <div className="grid grid-cols-2 gap-4 w-full max-w-md">
                  <Card className="p-4 text-center hover:bg-gray-50 cursor-pointer transition-colors">
                    <User className="h-8 w-8 mx-auto text-blue-500 mb-2" />
                    <h4 className="font-medium">Service Advisor</h4>
                    <p className="text-sm text-gray-500">Contact about your service</p>
                  </Card>
                  <Card className="p-4 text-center hover:bg-gray-50 cursor-pointer transition-colors">
                    <Calendar className="h-8 w-8 mx-auto text-blue-500 mb-2" />
                    <h4 className="font-medium">Appointments</h4>
                    <p className="text-sm text-gray-500">Schedule or modify</p>
                  </Card>
                </div>
              </Card>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-6">
        <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-500 text-sm mb-2 md:mb-0">© 2025 Becnels Automotive, LLC. All rights reserved.</div>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-500 hover:text-gray-700 text-sm">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-500 hover:text-gray-700 text-sm">
              Terms of Service
            </a>
            <a href="#" className="text-gray-500 hover:text-gray-700 text-sm">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}

