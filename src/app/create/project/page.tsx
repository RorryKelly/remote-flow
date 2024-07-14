import styles from './project.module.css';
import Image from 'next/image';
import UserDetails from './segments/userDetails';
import ProjectName from './segments/projectName';
import {SegmentRenderer} from './segments/segmentRenderer';
import Tasks from './segments/tasks';
import Stages from './segments/stages';
import Users from './segments/users';

export default function createProject(){
    return(
        <main className={styles.content}>
            <nav id='navigation bar' className={styles.navbar}>
                <Image 
                    width={115}
                    height={115}
                    src="/assets/logo_white.png" 
                    alt="Remote Flow Logo - Large White"
                    className={styles.logo}/>
            </nav>

            <SegmentRenderer>
                <UserDetails />
                <ProjectName />
                <Tasks />
                <Stages />
                <Users />
            </SegmentRenderer>
        </main>
    );
}