import { Attachment } from "./auth";

export type QuestionForm = {
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