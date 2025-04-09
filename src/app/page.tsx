"use client";

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Image from "next/image";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push('/login');
  }, [router]);

  return null;
}
