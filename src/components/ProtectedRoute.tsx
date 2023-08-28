import * as React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { RootState } from '../app/store';

export interface IProtectedRouteProps {
    children: React.ReactNode | JSX.Element;
}

export default function ProtectedRoute(props: IProtectedRouteProps) {
    const { children } = props;
    const currentUser = useSelector(
        (state: RootState) => state.auth.currentUser
    );

    if (!currentUser) {
        return <Navigate to={'/login'} />;
    }
    return <>{children}</>;
}
