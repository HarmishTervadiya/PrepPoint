import { Attachment } from "./auth";

export type QuestionForm = {
    title: string;
    subject: string;
    marks: string;
    answer: string;
    attachments: null | Attachment[];
  };
  
  export interface Question {
    title: string;
    subject: string;
    marks: number;
    attachments: null | Attachment[];
    content: string;
    loading: boolean;
    error: null | string;

}; 