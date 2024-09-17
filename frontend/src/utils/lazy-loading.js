import { lazy } from 'react'

export const Admin = lazy(() => import('../pages/admin/Admin'))

export const AdminHome = lazy(() => import('../pages/admin/AdminHome'))

export const AdminSubProducts = lazy(() => import('../pages/admin/AdminSubProducts'))

export const Api = lazy(() => import('../pages/api/Api'))

export const EmailUpdate = lazy(() => import('../pages/user/EmailUpdate'))

export const Docs = lazy(() => import('../pages/docs/Docs'))

export const UserNameUpdate = lazy(() => import('../pages/user/UserNameUpdate'))

export const PasswordChange = lazy(() => import('../pages/user/PasswordChange'))

export const Pricing = lazy(() => import('../pages/pricing/Pricing'))

export const ProductAuthInfo = lazy(() => import('../pages/product/ProductAuthInfo'))

export const UserBlockAdmin = lazy(() => import('../pages/admin/UserBlockAdmin'))

export const UserEditAdminForm = lazy(() => import('../pages/admin/UserEditAdminForm'))

export const CheckoutSuccessReg = lazy(() => import('../pages/checkout-success/CheckoutSuccessReg'))

export const CheckoutSuccessSub = lazy(() => import('../pages/checkout-success/CheckoutSuccessSub'))

export const CheckoutFailureRegular = lazy(() => import('../pages/checkout-failure/CheckoutFailureRegular'))

export const CheckoutFailureSub = lazy(() => import('../pages/checkout-failure/CheckoutFailureSub'))

export const GuestUserBuilder = lazy(() => import('../pages/guest-user/GuestUserBuilder'))

export const ForgotPasswordForm = lazy(() => import('../pages/profile-settings/ForgotPasswordForm'))

export const Invoice = lazy(() => import('../pages/OrderStore/Invoice'))

export const LoginOTP = lazy(() => import('../pages/profile-settings/LoginOTP'))

export const OrderDetails = lazy(() => import('../pages/OrderStore/OrderDetails'))

export const OrderStoreBuilder = lazy(() => import('../pages/OrderStore/OrderStoreBuilder'))

export const ProductList = lazy(() => import('../pages/product/ProductList'))

export const UserList = lazy(() => import('../pages/user/UserList'))

export const UserEditForm = lazy(() => import('../pages/user/UserEditForm'))

export const ProductEditForm = lazy(() => import('../pages/product/ProductEditForm'))

export const CategoryList = lazy(() => import('../pages/category/CategoryList'))

export const CategoryDetailsEditForm = lazy(() => import('../pages/category/CategoryDetailsEditForm'))

export const CategoryForm = lazy(() => import('../pages/category/CategoryForm'))

export const EmailConfirmation = lazy(() => import('../pages/profile-settings/EmailConfirmation'))

export const LoginForm = lazy(() => import('../pages/login/LoginForm'))

export const ProductDetails = lazy(() => import('../pages/product/ProductDetails'))

export const ProductFormData = lazy(() => import('../pages/product/ProductFormData'))

export const RegisterForm = lazy(() => import('../pages/register/RegisterForm'))

export const ResetPasswordForm = lazy(() => import('../pages/profile-settings/ResetPasswordForm'))

export const SharedEditView = lazy(() => import('../pages/user/SharedEditView'))

export const UserDetails = lazy(() => import('../pages/user/UserDetails'))

export const ShoppingCartBuilder = lazy(() => import('../pages/shopping-store/ShoppingCartBuilder'))

export const SubscriptionProducts = lazy(() => import('../pages/subscription/SubscriptionProducts'))

export const SubscriptionCartBuilder = lazy(() => import('../pages/subscription/SubscriptionCartBuilder'))

export const AuthShowProducts = lazy(() => import('../pages/shopping-store/AuthShowProducts'))
