import classes from './User.module.css';
import UserHeader from '../components/User/Profile/UserHeader';
import SettingList from '../components/User/Setting/SettingList';
import { ScrollRestoration } from 'react-router-dom';
import UserCategorySetting from '../components/User/Category/UserCategorySetting';
import { useState } from 'react';

function User() {
    const [showCategory, setShowCategory] = useState(false);

    const settings = [
        {
            title: '가계부 설정',
            items: [
                {
                    icon: '💰',
                    label: '기본 예산 설정',
                    show: (isShow: boolean) => {},
                },
                {
                    icon: '📅',
                    label: '월 시작일 설정',
                    show: (isShow: boolean) => {},
                },
                {
                    icon: '🔖',
                    label: '카테고리 설정',
                    show: setShowCategory,
                },
            ],
        },
        {
            title: '기본 설정',
            items: [
                {
                    icon: '➕',
                    label: '크기 설정',
                    show: (isShow: boolean) => {},
                },
                {
                    icon: '🎨',
                    label: '색상 설정',
                    show: (isShow: boolean) => {},
                },
                {
                    icon: '🌏',
                    label: '언어 설정',
                    show: (isShow: boolean) => {},
                },
            ],
        },
        {
            title: '회원 설정',
            items: [
                {
                    icon: '👤',
                    label: '회원 정보 수정하기',
                    show: (isShow: boolean) => {},
                },
            ],
        },
    ];

    return (
        <>
            <ScrollRestoration />
            <UserHeader userName="이름" email="username@gmail.com" />
            <main className={classes.container}>
                <section>
                    {settings.map((data, i) => (
                        <SettingList
                            key={i}
                            title={data.title}
                            items={data.items}
                        />
                    ))}
                </section>
                <section>
                    <UserCategorySetting
                        isOpen={showCategory}
                        setIsOpen={setShowCategory}
                    />
                </section>
            </main>
        </>
    );
}

export default User;
