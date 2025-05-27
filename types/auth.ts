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

export type ForgotPasswordFormData = {
  email: string;
  otp: string;
  newPassword: string;
  confirmPassword: string;
};

export interface DropdownOption {
  label: string;
  value: string;
}

export interface Attachment {
  isLocal?: boolean;
  publicId?: any;
  uri: string;
  type: string;
  size: number;
}

export interface CloudinaryAttachment {
  uri: string; 
  type: string;
  size?: number;
  publicId?: string; 
  isLocal?: boolean; 
}
