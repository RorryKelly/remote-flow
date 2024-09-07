import Image from 'next/image';
import { redirect } from 'next/navigation'
import { auth } from "@/auth";
import styles from "./dashboard.module.css";
import { FaTasks, FaRegBell, FaUsers, FaRegUserCircle } from "react-icons/fa";
import { MdAvTimer, MdAutoGraph, MdOutlineSettings, MdOutlineExitToApp } from "react-icons/md";
import ChatBoxProvider from '@/components/chat/chatbox-provider';

export default async function RootLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    const session = await auth();
    if(!session || !session.user){
      redirect('/');
    }

    return (
        <div className={styles.appContainer}>
            <aside className={styles.navSidebarContainer}>
                <div className={styles.navSidebar}>
                    <div>
                        <Image 
                            width={45}
                            height={45}
                            src="/assets/logo_white.png" 
                            alt="Remote Flow Logo - Large White"
                            className={styles.logo}/>

                        <div className={styles.iconBlock}>
                            <FaTasks size={'1.5rem'}/>
                            <MdAvTimer size={'1.75rem'}/>
                            <MdAutoGraph size={'1.75rem'}/>
                            <FaRegBell size={'1.5rem'} />
                            <FaUsers size={'1.5rem'} />
                        </div>
                    </div>

                    <div className={styles.iconBlock}>
                        <MdOutlineSettings size={'1.75rem'} />
                        <FaRegUserCircle size={'1.5rem'} />
                        <MdOutlineExitToApp size={'1.75rem'} />
                    </div>
                </div>
            </aside>

            <section className={styles.mainContent}>
                {children}
                <div className={styles.chatboxContainer}>
                    <ChatBoxProvider />
                </div>
            </section>
        </div>
    );
  }