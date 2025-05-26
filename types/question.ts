import { Attachment } from "./auth";

export type QuestionForm = {
    id?: string;
    title: string;
    subject: string;
    marks: number;
    answer: string;
    attachments: null | Attachment[];
  };
  
  export interface QuestionState {
    title: string;
    subject: string;
    marks: number;
    attachments: null | Attachment[];
    content: string;
    loading: boolean;
    error: null | string;
}; 

export interface QuestionListState {
  questions : Question[];
  loading: boolean;
  error: null | string;
}; 


export interface Question {
  id: string;
  owner: any;
  title: string;
  subject: string;
  marks: number;
  attachments: null | Attachment[];
  content: string;
  reads: number;
  date: string
}; 

export interface Analytics {
  totalReads: number,
  totalQuestions: number,
  totalEarnings: number,
  availableBalance: number,
  recentActivity: Question[],
  withdrawalHistory: WithdrawalRequest[],
  error: string | null
}

export interface WithdrawalRequest {
  _id: string;
  studentId: string;
  upiId: string;
  amount: string;
  status: string;
  createdAt: string;
}