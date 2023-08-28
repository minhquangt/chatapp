import * as React from 'react';
import Sidebar from '../../components/Sidebar';

export interface IHomeProps {}

export default function Home(props: IHomeProps) {
    return (
        <div className=''>
            <Sidebar />
        </div>
    );
}
