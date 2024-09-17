import React, { Suspense } from 'react'
import '../node_modules/bootstrap/dist/js/bootstrap'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { GoogleOAuthProvider } from '@react-oauth/google'
import HomeProducts from './pages/home/HomeProducts'
import NoMatch from './pages/no-match/NoMatch'
import { AuthProvider } from './context/AuthContext'
import { LayoutAdmin, LayoutAuthUser, LayoutPublic, CommonLayOut } from './components/auth-layout/AuthLayout'

import { Admin, AdminHome, AdminSubProducts, Api, EmailUpdate, Docs, UserNameUpdate, PasswordChange, UserEditAdminForm, UserBlockAdmin, CheckoutSuccessReg, CheckoutSuccessSub, CheckoutFailureRegular, CheckoutFailureSub, ForgotPasswordForm, Invoice, ProductList, ProductEditForm, ProductAuthInfo, SharedEditView, UserEditForm, UserList, CategoryList, CategoryDetailsEditForm, CategoryForm, EmailConfirmation, GuestUserBuilder, LoginForm, LoginOTP, OrderDetails, OrderStoreBuilder, ProductDetails, Pricing, ProductFormData, RegisterForm, ResetPasswordForm, UserDetails, ShoppingCartBuilder, SubscriptionProducts, SubscriptionCartBuilder, AuthShowProducts } from './utils/lazy-loading'

const router = createBrowserRouter([
  {
    path: '/',
    element: <LayoutPublic />,
    children: [
      { path: 'product/:productId', element: <ProductDetails /> },
      { path: 'email/confirm/:token', element: <EmailConfirmation /> },
      { path: 'cart/guest', element: <GuestUserBuilder /> },
      { path: 'login', element: <LoginForm /> },
      { path: 'otp/2fa/:userId', element: <LoginOTP /> },
      { path: 'forgot/password', element: <ForgotPasswordForm /> },
      { path: 'password/reset/:token', element: <ResetPasswordForm /> },
      { path: 'register', element: <RegisterForm /> },
      { path: '/', element: <HomeProducts /> }
    ]
  },
  {
    path: '/admin',
    element: <LayoutAdmin />,
    children: [
      { path: 'product/update/:productId', element: <ProductEditForm /> },
      { path: 'category/update/:categoryId', element: <CategoryDetailsEditForm /> },
      { path: 'user/update/:userId', element: <UserEditAdminForm /> },
      { path: 'user/block/:userId', element: <UserBlockAdmin /> },
      { path: 'categorylist', element: <CategoryList /> },
      { path: 'productlist', element: <ProductList /> },
      { path: 'sub/products', element: <AdminSubProducts /> },
      { path: 'categoryform', element: <CategoryForm /> },
      { path: 'productform', element: <ProductFormData /> },
      { path: 'system', element: <Admin /> },
      { path: 'adminhome', element: <AdminHome /> },
      { path: 'userlist', element: <UserList /> }

    ]
  },
  {
    path: '/auth',
    element: <LayoutAuthUser />,
    children: [
      { path: 'product/:productId', element: <ProductDetails /> },
      { path: 'user', element: <UserDetails /> },
      { path: 'user/update', element: <UserEditForm /> },
      { path: 'user/email/update', element: <EmailUpdate /> },
      { path: 'user/username/update', element: <UserNameUpdate /> },
      { path: 'user/passwordchange/update', element: <PasswordChange /> },
      { path: 'user/shared/update', element: <SharedEditView /> },
      { path: 'shoppingcart', element: <ShoppingCartBuilder /> },
      { path: 'sub/products', element: <SubscriptionProducts /> },
      { path: 'sub/shoppingcart', element: <SubscriptionCartBuilder /> },
      { path: 'order/details/:sessionId', element: <OrderDetails /> },
      { path: 'order/details/invoice/:sessionId', element: <Invoice /> },
      { path: 'order/history', element: <OrderStoreBuilder /> },
      { path: 'checkout/regular/success/:sessionId', element: <CheckoutSuccessReg /> },
      { path: 'checkout/sub/success/:sessionId', element: <CheckoutSuccessSub /> },
      { path: 'checkout/failure/regular/:sessionId', element: <CheckoutFailureRegular /> },
      { path: 'checkout/failure/sub/:sessionId', element: <CheckoutFailureSub /> },
      { path: 'show', element: <AuthShowProducts /> }
    ]
  },
  {
    path: '/common',
    element: <CommonLayOut />,
    children: [
      { path: 'docs', element: <Docs /> },
      { path: 'pricing', element: <Pricing /> },
      { path: 'api', element: <Api /> },
      { path: 'product/:productId', element: <ProductAuthInfo /> }
    ]
  },
  {
    path: '*',
    element: <NoMatch />
  }
])

function App () {
  return (
    <>
      <AuthProvider>
        <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
          <Suspense fallback={<div>...loading</div>}>
            <ToastContainer style={{ width: '300px' }} position='top-center' theme='colored' hideProgressBar limit={1} />
            <RouterProvider router={router} />
          </Suspense>
        </GoogleOAuthProvider>
      </AuthProvider>
    </>
  )
}
export default App
