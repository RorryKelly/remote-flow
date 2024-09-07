'use client'
import { activity } from "@/lib/definitions";
import styles from './activity.module.css';
import { FaPen } from "react-icons/fa";
import rehypeRaw from "rehype-raw";
import Markdown from "react-markdown";
import parseJson from "../json/parser";

interface activityProps{
    activitiesJson: string
    value: number
}

export default function Activity({activitiesJson}: activityProps){
    const activities = parseJson<activity[]>(activitiesJson);

    return (
        <>
            {activities.map((activity, index)=>(
                <div key={`activity-${index}`} className={styles.activity}>
                    <span><span ><FaPen size={'1.5rem'}/></span></span>
                    <span className={styles.statement}>
                        <div>
                            <Markdown rehypePlugins={[rehypeRaw]}>
                                {activity.log}
                            </Markdown>
                        </div>
                    </span>
                </div>
            ))}
        </>
    );
}