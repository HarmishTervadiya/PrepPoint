import {Attachment} from './auth';
import {Question} from './question';
import {Institute} from './institute';
import {Course} from './course';

export interface UserProfileState {
  user: User;
  userQuestions: Question[];
  searchResults: Question[];
  loading: boolean;
  error: string | null;
}

export interface User {
  _id: string;
  username: string | null;
  name: string;
  email: string;
  institute: Institute;
  course: Course;
  profilePic: Attachment;
  createdAt: string;
}

export interface Contributor {
  owner: User;
  totalReads: number;
  questionCount: number;
}

export interface ContributorListState {
  contributors: Contributor[]
}