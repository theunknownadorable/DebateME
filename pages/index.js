import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarContent, AvatarFallback } from '@/components/ui/avatar';
import { MessageCircle, Bot, User, Loader2 } from 'lucide-react';

const personalities = [
  { value: 'serious-scholar', label: 'Serious Scholar' },
  { value: 'snarky-comedian', label: 'Snarky Comedian' },
  { value: 'aggressive-politician', label: 'Aggressive Politician' },
  { value: 'chill-philosopher', label: 'Chill Philosopher' }
];

const stances = [
  { value: 'for', label: 'For' },
  { value: 'against', label: 'Against' }
];

export default function DebateMeAI() {
  const [topic, setTopic] = useState('');
  const [stance, setStance] = useState('');
  const [personality, setPersonality] = useState('');
  const [userArgument, setUserArgument] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleStartDebate = async () => {
    if (!topic || !stance || !personality || !userArgument) {
      alert('Please fill in all fields before starting the debate.');
      return;
    }

    setIsLoading(true);

    // Add user message to chat
    const userMessage = {
      type: 'user',
      content: userArgument,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);

    try {
      const response = await fetch('/api/debate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic,
          stance,
          personality,
          userArgument,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Add AI message to chat
      const aiMessage = {
        type: 'ai',
        content: data.counterArgument,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMessage]);
      setUserArgument(''); // Clear the input for next round

    } catch (error) {
      console.error('Error:', error);
      const errorMessage = {
        type: 'error',
        content: 'Sorry, there was an error generating the counterargument. Please try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearDebate = () => {
    setMessages([]);
    setTopic('');
    setStance('');
    setPersonality('');
    setUserArgument('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <MessageCircle className="h-10 w-10 text-blue-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Debate Me, AI
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Challenge your arguments against a powerful AI opponent. Choose your stance, pick an AI personality, and engage in thought-provoking debates.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Setup Panel */}
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Bot className="h-5 w-5 text-blue-600" />
                Debate Setup
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Debate Topic */}
              <div className="space-y-2">
                <Label htmlFor="topic" className="text-sm font-medium text-gray-700">
                  Debate Topic
                </Label>
                <Input
                  id="topic"
                  placeholder="e.g., Social media does more harm than good"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              {/* User Stance */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Your Stance
                </Label>
                <Select value={stance} onValueChange={setStance}>
                  <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                    <SelectValue placeholder="Choose your position" />
                  </SelectTrigger>
                  <SelectContent>
                    {stances.map((s) => (
                      <SelectItem key={s.value} value={s.value}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* AI Personality */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  AI Opponent Personality
                </Label>
                <Select value={personality} onValueChange={setPersonality}>
                  <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                    <SelectValue placeholder="Select AI personality" />
                  </SelectTrigger>
                  <SelectContent>
                    {personalities.map((p) => (
                      <SelectItem key={p.value} value={p.value}>
                        {p.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* User Argument */}
              <div className="space-y-2">
                <Label htmlFor="argument" className="text-sm font-medium text-gray-700">
                  Your Opening Argument
                </Label>
                <Textarea
                  id="argument"
                  placeholder="Present your argument with evidence and reasoning..."
                  value={userArgument}
                  onChange={(e) => setUserArgument(e.target.value)}
                  rows={4}
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  onClick={handleStartDebate}
                  disabled={isLoading || !topic || !stance || !personality || !userArgument}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:scale-100"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Thinking...
                    </>
                  ) : (
                    'Start Debate'
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={clearDebate}
                  className="border-gray-300 text-gray-600 hover:bg-gray-50"
                >
                  Clear
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Chat Area */}
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <MessageCircle className="h-5 w-5 text-green-600" />
                Debate Arena
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96 overflow-y-auto space-y-4 p-4 bg-gray-50/50 rounded-lg border">
                {messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <div className="text-center">
                      <MessageCircle className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                      <p>No debate started yet.</p>
                      <p className="text-sm">Fill in the form and click "Start Debate" to begin!</p>
                    </div>
                  </div>
                ) : (
                  messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {message.type !== 'user' && (
                        <Avatar className="h-8 w-8 mt-1">
                          <AvatarFallback className="bg-blue-100 text-blue-600">
                            <Bot className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                      
                      <div
                        className={`max-w-[75%] rounded-lg px-4 py-3 ${
                          message.type === 'user'
                            ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                            : message.type === 'error'
                            ? 'bg-red-100 text-red-800 border border-red-200'
                            : 'bg-white text-gray-800 border border-gray-200'
                        }`}
                      >
                        <p className="text-sm leading-relaxed">{message.content}</p>
                        <p className={`text-xs mt-1 ${
                          message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          {message.timestamp}
                        </p>
                      </div>

                      {message.type === 'user' && (
                        <Avatar className="h-8 w-8 mt-1">
                          <AvatarFallback className="bg-green-100 text-green-600">
                            <User className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-gray-500">
          <p className="text-sm">
            Powered by Google Gemini AI • Built with Next.js & Tailwind CSS
          </p>
        </div>
      </div>
    </div>
  );
}