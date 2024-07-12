import "./globals.css";
import { auth } from '@/auth';
import LandingPage from "@/app/landingPage/landingPage"

export default async function AppInit() {
  const session = await auth();
  console.log(session);
  return session ? (<>test</>) : (<LandingPage />);
}