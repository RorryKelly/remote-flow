import Image from 'next/image';
import styles from './app.module.css';
import { FaCheck } from "react-icons/fa6";
import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";
import DropdownButton from "../../../components/dropdownButton/DropdownButton";
import { signIn } from '@/auth';

export default function LandingPage() {
  return (
    <main>
      <section className={styles.landingPage}>
        <Hero />
        <AllInOneApp />
        <ProductivityAppForYou />
        <Footer />
      </section>
    </main>
  );
}

function Navbar() {
  const googleLogin = async () => {
      'use server'
      await signIn("google");
  }
  return (
    <nav id='navigation bar' className={styles.navbar}>
      <Image 
        width={82}
        height={68}
        src="/assets/Logo.png" 
        alt="Remote Flow Logo - small"
        className={styles.logo}/>
      
      <ul className={styles.navActions}>
        <li>Home</li>
        <li>About Us</li>
        <li>
          <DropdownButton googleLogin={googleLogin}/>
        </li>
      </ul>
    </nav>
  )
}

function Hero() {
  return (
    <section id='hero'>
      <Navbar />
      
      <div className={styles.titleCard}>
        <Image
          width={486}
          height={501}
          src="/assets/Amigos Chatting.png"
          className={styles.heroImage} 
          alt="hero image"
          unoptimized/>

        <div>
          <strong style={{fontSize: "1.313rem"}}>Stay in Sync, Stay in Flow</strong>
          <h1 className={styles.header}>Remote Flow</h1>
          <p className={`${styles.hint} ${styles.large}`}>
            Welcome to Remote Flow: Your Complete Solution for Remote Productivity. Track tasks, manage time effortlessly, 
            and collaborate seamlessly with teams, all in one intuitive platform designed to maximize your efficiency and focus while working remotely. 
            Empower your productivity journey today!
          </p>
          <ul style={{listStyle: "none", padding: "0"}}>
            <li style={{marginRight: '1rem'}} className="button dark">Login</li>
            <li className="button light">More Information</li>
          </ul>
        </div>
      </div>
    </section>
  )
}

function AllInOneApp(){
  return (
    <section id='All In One App' className={styles.allInOneApp}>
      <div style={{gridColumnStart: 4, gridColumnEnd: 10}}>
        <h2 className={styles.header}>All In One App</h2>
        <p className={`${styles.hint} ${styles.large}`}>
          Say goodbye to constant disruptions knocking you out of your state of flow. 
          Become the most efficient version of yourself!
        </p>
      </div>

      <hr style={{gridColumnStart: 1, gridColumnEnd: 13}}/>

      <div className={styles.allInOneAppContent}>
        <ul className={styles.benefitsList}>
          <li>
            <span className={styles.iconBox}>
              <FaCheck />
            </span>
            <div>
              <h2 className={styles.subHeader}>User Friendly</h2>
              <p className={styles.hint}>RemoteFlow has been built with intuitiveness in mind. It won&apos;t take long before you&apos;re fully proficient with the application.</p>
            </div>
          </li>
          <li>
            <span className={styles.iconBox}>
              <FaCheck />
            </span>
            <div>
              <h2 className={styles.subHeader}>Enhanced Productivity</h2>
              <p className={styles.hint}>Streamline your workflow and boost productivity effortlessly. Its intuitive design and powerful features help you stay focused on your tasks, leading to greater efficiency and output.</p>
            </div>
          </li>
          <li>
            <span className={styles.iconBox}>
              <FaCheck />
            </span>
            <div>
              <h2 className={styles.subHeader}>Seamless Team Collaboration</h2>
              <p className={styles.hint}>Foster collaboration among remote teams with RemoteFlow&apos;s robust tools. From assigning tasks and tracking progress to analyzing team metrics, enhance teamwork and achieve collective goals seamlessly.</p>
            </div>
          </li>
        </ul>

        <div className={styles.creationExampleImage}>
          <Image
            width={935}
            height={822}
            layout='responsive'
            src="/assets/creation-example.png"
            alt="An example of project creation" 
            unoptimized/>
        </div>
      </div>
    </section>
  );
}

function ProductivityAppForYou(){
  return (
    <section id='A Productivity App For You' className={styles.productivityAppForYou}>
      <h2 style={{gridColumnStart: 4, gridColumnEnd: 10}} className={styles.header}>The Right App For Your Productivity</h2>
      <hr style={{gridColumnStart: 1, gridColumnEnd: 13}}/>

      <div className={styles.productivityAppForYouContent} style={{gridColumnStart: 1, gridColumnEnd: 13}}>
        <div>
          <h3 className={styles.subHeader}>Activity Monitoring:</h3>
          <p className={styles.hint}>Stay productive with real-time activity monitoring. Track active computer time, monitor application usage including code editors and browsers, and detect idle time to optimize your workflow.</p>
          <Image
            width={551}
            height={335}
            layout='responsive'
            src="/assets/Brazuca Screen 3.png"
            alt="An example of project creation"
            unoptimized />
        </div>
        <div>
          <h3 className={styles.subHeader}>Task Management:</h3>
          <p className={styles.hint}>Effortlessly manage your tasks with Remote Flow. Create, update, and delete tasks, assign them to specific projects, and set priorities and deadlines to stay organized and productive.</p>
          <Image
            width={552}
            height={504}
            layout='responsive'
            src="/assets/The Little Things Working.png"
            alt="An example of project creation"
            unoptimized />
        </div>
        <div>
          <h3 className={styles.subHeader}>Team Collaboration:</h3>
          <p className={styles.hint}>Enhance team productivity with Remote Flow&apos;s collaboration features. Create and manage teams, assign tasks to team members, and gain insights into team productivity metrics and detailed reports.</p>
          <Image
            width={549}
            height={293}
            layout='responsive'
            src="/assets/Allura Teamwork.png"
            alt="An example of project creation"
            unoptimized />
        </div>
        <div>
          <h3 className={styles.subHeader}>Integrations:</h3>
          <p className={styles.hint}>Seamlessly integrate with your favorite tools. Connect with calendar apps like Google Calendar for event synchronization, sync tasks with project management tools such as Trello and Jira, and use communication tools like Slack for timely notifications.</p>
          <Image
            width={551}
            height={504}
            layout='responsive'
            src="/assets/integration.png"
            alt="An example of project creation"
            unoptimized />
        </div>
      </div>

    </section>
  );
}

function Footer(){
  return (
    <section className={styles.footer}>
      <Image 
        width={106}
        height={95}
        src="/assets/Logo.png" 
        alt="Remote Flow Logo - large"
        unoptimized/>

      <p className={styles.footerText}>Our vision is to help you achieve more! Become the most productive version of yourself.</p>

      <div className={styles.socialIcons}>
        <span style={{fontSize: '15px'}}>
          <FaFacebookF />
        </span>
        <span>
          <FaTwitter />
        </span>
        <span>
          <FaInstagram />
        </span>
      </div>

      <hr style={{gridColumnStart: 2, gridColumnEnd: 12}}/>

      <div className={styles.footerText}>©2024 RemoteFlow. All rights reserved</div>
    </section>
  );
}
