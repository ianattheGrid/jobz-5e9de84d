
import { FormField } from "./FormFields";

interface CommonFieldsProps {
  email: string;
  setEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  fullName: string;
  setFullName: (value: string) => void;
  jobTitle: string;
  setJobTitle: (value: string) => void;
  userType: string;
  hideJobTitle?: boolean;
}

export const CommonFields = ({
  email,
  setEmail,
  password,
  setPassword,
  fullName,
  setFullName,
  jobTitle,
  setJobTitle,
  userType,
  hideJobTitle = false
}: CommonFieldsProps) => (
  <>
    <FormField
      id="fullName"
      label="Full Name"
      value={fullName}
      onChange={(e) => setFullName(e.target.value)}
      placeholder="Enter your full name"
      required
    />

    <FormField
      id="email"
      label="Email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      placeholder={userType === 'employer' ? "Enter your work email" : "Enter your email"}
      type="email"
      required
    />

    {!hideJobTitle && (
      <FormField
        id="jobTitle"
        label="Job Title"
        value={jobTitle}
        onChange={(e) => setJobTitle(e.target.value)}
        placeholder="Enter your job title"
      />
    )}

    <FormField
      id="password"
      label="Password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      placeholder="Create a password"
      type="password"
      required
    />
  </>
);
