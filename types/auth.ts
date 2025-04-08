export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  name: string;
  email: string;
  password: string;
}

export interface VerificationForm {
  username: string;
  institute: string;
  course: string;
  proof: Attachment;
}
export interface DropdownOption {
  label: string;
  value: string;
}

export interface Attachment {
  uri: string;
  type: string;
  size: number;
}

