import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Package2, ArrowLeft } from 'lucide-react';
import LoginMethods from './LoginMethods';
import PasswordlessForm from './PasswordlessForm';

const loginSchema = z.object({
  identifier: z.string().min(1, 'Required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const twoFactorSchema = z.object({
  code: z.string().length(6, 'Code must be 6 digits'),
});

const forgotPasswordSchema = z.object({
  identifier: z.string().min(1, 'Required'),
});

type LoginForm = z.infer<typeof loginSchema>;
type TwoFactorForm = z.infer<typeof twoFactorSchema>;
type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

interface LoginPageProps {
  onLogin: (userData: { name: string; email: string }) => void;
  mockUser: { name: string; email: string; has2FAEnabled: boolean };
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, mockUser }) => {
  const [loginMethod, setLoginMethod] = useState<'account' | 'passwordless'>('account');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [show2FA, setShow2FA] = useState(false);
  const [passwordlessLinkSent, setPasswordlessLinkSent] = useState(false);

  const { register: loginRegister, handleSubmit: handleLoginSubmit, formState: { errors: loginErrors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const { register: twoFactorRegister, handleSubmit: handle2FASubmit, formState: { errors: twoFactorErrors } } = useForm<TwoFactorForm>({
    resolver: zodResolver(twoFactorSchema),
  });

  const { register: forgotPasswordRegister, handleSubmit: handleForgotSubmit, formState: { errors: forgotErrors } } = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onLoginSubmit = (data: LoginForm) => {
    if (mockUser.has2FAEnabled) {
      setShow2FA(true);
    } else {
      onLogin(mockUser);
    }
  };

  const on2FASubmit = (data: TwoFactorForm) => {
    onLogin(mockUser);
  };

  const onForgotPasswordSubmit = (data: ForgotPasswordForm) => {
    alert(`Password reset link sent to ${data.identifier}`);
    setShowForgotPassword(false);
  };

  const handlePasswordlessSuccess = () => {
    setPasswordlessLinkSent(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-white">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div className="text-center">
          <Package2 className="mx-auto h-12 w-12 text-blue-600" />
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Welcome back</h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to your account
          </p>
        </div>

        <LoginMethods loginMethod={loginMethod} setLoginMethod={setLoginMethod} />

        {loginMethod === 'passwordless' ? (
          <PasswordlessForm onSuccess={handlePasswordlessSuccess} />
        ) : (
          <>
            {!show2FA && !showForgotPassword && (
              <form className="mt-8 space-y-6" onSubmit={handleLoginSubmit(onLoginSubmit)}>
                <div className="rounded-md shadow-sm space-y-4">
                  <div>
                    <label htmlFor="identifier" className="block text-sm font-medium text-gray-700">
                      Account ID
                    </label>
                    <input
                      {...loginRegister('identifier')}
                      type="text"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                    {loginErrors.identifier && (
                      <p className="mt-1 text-sm text-red-600">{loginErrors.identifier.message}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                      Password
                    </label>
                    <input
                      {...loginRegister('password')}
                      type="password"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                    {loginErrors.password && (
                      <p className="mt-1 text-sm text-red-600">{loginErrors.password.message}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-sm text-blue-600 hover:text-blue-500"
                  >
                    Forgot your password?
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Sign in
                </button>
              </form>
            )}

            {show2FA && (
              <form className="mt-8 space-y-6" onSubmit={handle2FASubmit(on2FASubmit)}>
                <div>
                  <label htmlFor="code" className="block text-sm font-medium text-gray-700">
                    2FA Code
                  </label>
                  <input
                    {...twoFactorRegister('code')}
                    type="text"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter 6-digit code"
                  />
                  {twoFactorErrors.code && (
                    <p className="mt-1 text-sm text-red-600">{twoFactorErrors.code.message}</p>
                  )}
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    type="button"
                    onClick={() => setShow2FA(false)}
                    className="flex items-center text-sm text-gray-600 hover:text-gray-500"
                  >
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Back
                  </button>
                  <button
                    type="submit"
                    className="flex-1 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Verify
                  </button>
                </div>
              </form>
            )}

            {showForgotPassword && (
              <form className="mt-8 space-y-6" onSubmit={handleForgotSubmit(onForgotPasswordSubmit)}>
                <div>
                  <label htmlFor="identifier" className="block text-sm font-medium text-gray-700">
                    Account ID
                  </label>
                  <input
                    {...forgotPasswordRegister('identifier')}
                    type="text"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                  {forgotErrors.identifier && (
                    <p className="mt-1 text-sm text-red-600">{forgotErrors.identifier.message}</p>
                  )}
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(false)}
                    className="flex items-center text-sm text-gray-600 hover:text-gray-500"
                  >
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Back
                  </button>
                  <button
                    type="submit"
                    className="flex-1 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Reset Password
                  </button>
                </div>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
