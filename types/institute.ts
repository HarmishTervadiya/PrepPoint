export interface Institute {
  _id: string;
  instituteName: string;
  createAt: string;
}

export interface InstituteState {
  institutes: Institute[];
  instituteDetails: string | null;
  institutesLoading: boolean;
  institutesError: string | null;
}
