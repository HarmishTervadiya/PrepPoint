export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  username: string;
  email: string;
  password: string;
  institute: string;
  course: string;
  proof: FormData | null; // Changed from File to FormData for React Native compatibility
}

export interface DropdownOption {
  label: string;
  value: string;
}

export interface Attachment {
  uri: string;
  type: string;
}

