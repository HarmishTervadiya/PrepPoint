import { Attachment } from "./auth";

export interface Institute {
  _id: string;
  instituteName: string;
  instituteLogo: Attachment;
  createAt: string;
}

export interface InstituteState {
  institutes: Institute[];
  instituteDetails: string | null;
  institutesLoading: boolean;
  institutesError: string | null;
}
