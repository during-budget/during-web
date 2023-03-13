import classes from './User.module.css';
import UserHeader from '../components/User/Profile/UserHeader';
import SettingList from '../components/User/Setting/SettingList';
import { ScrollRestoration } from 'react-router-dom';

const SETTING_DATA = [
    {
        title: '가계부 설정',
        items: [
            { icon: '💰', label: '기본 예산 설정', to: '' },
            { icon: '📅', label: '월 시작일 설정', to: '' },
            { icon: '🔖', label: '카테고리 설정', to: '' },
        ],
    },
    {
        title: '기본 설정',
        items: [
            { icon: '➕', label: '크기 설정', to: '' },
            { icon: '🎨', label: '색상 설정', to: '' },
            { icon: '🌏', label: '언어 설정', to: '' },
        ],
    },
    {
        title: '회원 설정',
        items: [{ icon: '👤', label: '회원 정보 수정하기', to: '' }],
    },
];

function User() {
    return (
        <>
            <ScrollRestoration />
            <UserHeader userName="이름" email="username@gmail.com" />
            <main className={classes.container}>
                <section>
                    {SETTING_DATA.map((data, i) => (
                        <SettingList key={i} title={data.title} items={data.items} />
                    ))}
                </section>
            </main>
        </>
    );
}

export default User;
