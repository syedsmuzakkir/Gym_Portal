"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Hash, Plus, Search, MoreVertical, Edit, Trash2, Pin, MessageSquare, Send } from "lucide-react"
import { generateTeamMessages, formatMessageTime } from "@/lib/team-communication"

export default function MessageBoard() {
  const [selectedChannel, setSelectedChannel] = useState("general")
  const [searchQuery, setSearchQuery] = useState("")
  const [newMessage, setNewMessage] = useState("")
  const [isComposing, setIsComposing] = useState(false)

  const { channels, messages: initialMessages } = generateTeamMessages()
  const [messages, setMessages] = useState(initialMessages)

  const filteredMessages = messages
    .filter((msg) => msg.channel === selectedChannel)
    .filter(
      (msg) =>
        searchQuery === "" ||
        msg.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        msg.author.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    .sort((a, b) => {
      if (a.pinned && !b.pinned) return -1
      if (!a.pinned && b.pinned) return 1
      return b.timestamp - a.timestamp
    })

  const handleSendMessage = () => {
    if (!newMessage.trim()) return

    const message = {
      id: Date.now(),
      channel: selectedChannel,
      author: "You",
      role: "Staff",
      avatar: "/diverse-user-avatars.png",
      content: newMessage,
      timestamp: new Date(),
      edited: false,
      reactions: [],
    }

    setMessages((prev) => [message, ...prev])
    setNewMessage("")
    setIsComposing(false)
  }

  const handleDeleteMessage = (messageId) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== messageId))
  }

  const handlePinMessage = (messageId) => {
    setMessages((prev) => prev.map((msg) => (msg.id === messageId ? { ...msg, pinned: !msg.pinned } : msg)))
  }

  const addReaction = (messageId, emoji) => {
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id === messageId) {
          const existingReaction = msg.reactions.find((r) => r.emoji === emoji)
          if (existingReaction) {
            return {
              ...msg,
              reactions: msg.reactions.map((r) => (r.emoji === emoji ? { ...r, count: r.count + 1 } : r)),
            }
          } else {
            return {
              ...msg,
              reactions: [...msg.reactions, { emoji, count: 1 }],
            }
          }
        }
        return msg
      }),
    )
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] bg-gray-50">
      {/* Sidebar - Channels */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900 mb-3">Team Communication</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-700">Channels</h3>
              <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-1">
              {channels.map((channel) => (
                <button
                  key={channel.id}
                  onClick={() => setSelectedChannel(channel.id)}
                  className={`w-full flex items-center gap-2 px-2 py-1.5 rounded text-sm transition-colors ${
                    selectedChannel === channel.id ? "bg-purple-100 text-purple-700" : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <Hash className="h-4 w-4" />
                  <span className="truncate">{channel.name}</span>
                  <Badge variant="secondary" className="ml-auto text-xs">
                    {messages.filter((m) => m.channel === channel.id).length}
                  </Badge>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Hash className="h-5 w-5 text-gray-400" />
              <h1 className="font-semibold text-gray-900">{channels.find((c) => c.id === selectedChannel)?.name}</h1>
              <span className="text-sm text-gray-500">{filteredMessages.length} messages</span>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={() => setIsComposing(true)} className="bg-purple-600 hover:bg-purple-700">
                <MessageSquare className="h-4 w-4 mr-2" />
                New Message
              </Button>
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-1">{channels.find((c) => c.id === selectedChannel)?.description}</p>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <AnimatePresence>
            {filteredMessages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`group ${message.pinned ? "bg-yellow-50 border border-yellow-200 rounded-lg p-3" : ""}`}
              >
                <div className="flex gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={message.avatar || "/placeholder.svg"} />
                    <AvatarFallback>
                      {message.author
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-gray-900">{message.author}</span>
                      <Badge variant="outline" className="text-xs">
                        {message.role}
                      </Badge>
                      <span className="text-xs text-gray-500">{formatMessageTime(message.timestamp)}</span>
                      {message.edited && <span className="text-xs text-gray-400">(edited)</span>}
                      {message.pinned && <Pin className="h-3 w-3 text-yellow-600" />}
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed">{message.content}</p>

                    {/* Reactions */}
                    {message.reactions.length > 0 && (
                      <div className="flex gap-1 mt-2">
                        {message.reactions.map((reaction, index) => (
                          <button
                            key={index}
                            onClick={() => addReaction(message.id, reaction.emoji)}
                            className="flex items-center gap-1 px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-xs transition-colors"
                          >
                            <span>{reaction.emoji}</span>
                            <span>{reaction.count}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Message Actions */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => addReaction(message.id, "👍")}>Add Reaction</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handlePinMessage(message.id)}>
                        {message.pinned ? "Unpin" : "Pin"} Message
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDeleteMessage(message.id)} className="text-red-600">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredMessages.length === 0 && (
            <div className="text-center py-12">
              <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No messages yet</h3>
              <p className="text-gray-600">Be the first to start the conversation!</p>
            </div>
          )}
        </div>

        {/* Quick Message Input */}
        <div className="bg-white border-t border-gray-200 p-4">
          <div className="flex gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/diverse-user-avatars.png" />
              <AvatarFallback>You</AvatarFallback>
            </Avatar>
            <div className="flex-1 flex gap-2">
              <Input
                placeholder={`Message #${channels.find((c) => c.id === selectedChannel)?.name}`}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                className="flex-1"
              />
              <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
