import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  X,
  Send,
  Sparkles,
  HelpCircle,
  Lightbulb,
  BookOpen,
  GraduationCap,
} from 'lucide-react';
import { SKKNProject } from '../types/skkn';
import { sendConsultantChatMessage } from '../services/aiService';

interface AiConsultantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  project: SKKNProject;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export const AiConsultantDrawer: React.FC<AiConsultantDrawerProps> = ({
  isOpen,
  onClose,
  project,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `Kính chào thầy/cô! Tôi là Cố Vấn Sáng Kiến Kinh Nghiệm (EduSKKN AI). Tôi có thể hỗ trợ thầy/cô:
1. Tư vấn cấu trúc & cách hành văn cho đề tài "${project.metadata.title}".
2. Giải đáp các quy định của Bộ GD&ĐT (Thông tư 32/2018, Thông tư 22/2021, Thông tư 27/2020...).
3. Gợi ý các kỹ thuật dạy học tích cực (STEM, Dạy học dự án, Lớp học đảo ngược...).
4. Cách xử lý và phân tích số liệu thực nghiệm sư phạm.

Thầy/cô đang gặp vướng mắc ở phần nào ạ?`,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMsg: Message = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const reply = await sendConsultantChatMessage(
        [...messages, userMsg].map((m) => ({ role: m.role, content: m.content })),
        {
          title: project.metadata.title,
          gradeLevel: project.gradeLevel,
          subject: project.metadata.subject,
          grade: project.metadata.grade,
        }
      );

      const assistantMsg: Message = {
        role: 'assistant',
        content: reply,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const sampleQuestions = [
    'Làm sao để phần Biện pháp (Phần II) thể hiện rõ điểm mới?',
    'Cách chọn lớp Thực nghiệm và Đối chứng để số liệu tin cậy?',
    'Viết khuyến nghị với Phòng GD&ĐT như thế nào cho khéo léo?',
    'Cách lồng ghép công cụ AI và Canva vào bài dạy?',
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-200 bg-gradient-to-r from-indigo-700 to-blue-700 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Cố Vấn Sư Phạm & SKKN AI</h3>
              <p className="text-[11px] text-blue-100">
                Hỗ trợ phương pháp, văn bản pháp lý & kỹ năng viết
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-blue-700 text-white rounded-br-xs shadow-xs'
                    : 'bg-white text-slate-800 rounded-bl-xs border border-slate-200 shadow-2xs whitespace-pre-wrap'
                }`}
              >
                {msg.content}
              </div>
              <span className="text-[10px] text-slate-400 mt-1 px-1">{msg.timestamp}</span>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center space-x-2 text-xs text-slate-500 bg-white p-3 rounded-2xl border border-slate-200 max-w-[80%]">
              <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
              <span>Cố vấn đang tra cứu quy chuẩn và soạn câu trả lời...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="p-3 bg-white border-t border-slate-100 overflow-x-auto scrollbar-none flex gap-2">
          {sampleQuestions.map((q, i) => (
            <button
              key={i}
              onClick={() => setInput(q)}
              className="whitespace-nowrap px-2.5 py-1 text-[11px] bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-600 rounded-full transition-colors flex-shrink-0"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-slate-200 flex items-center space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Hỏi cố vấn về phương pháp, thông tư, cách viết..."
            className="flex-1 px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-600"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white transition-colors disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
