import "./globals.css";
import { redirect } from 'next/navigation'
import { auth } from '@/auth';
import LandingPage from "@/app/landingPage/landingPage"

export default async function AppInit() {
  return (<LandingPage />);
}