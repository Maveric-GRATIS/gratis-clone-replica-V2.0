# GRATIS.NGO Enterprise Development Prompts - PART 2
## Marketing Pages, Dashboard & Events (Sections 6-10)
### Total Estimated Size: ~30,000 tokens | Complexity: HIGH

---

# ═══════════════════════════════════════════════════════════════════════════════
# SECTION 6: HOMEPAGE & MARKETING PAGES
# ═══════════════════════════════════════════════════════════════════════════════

## PROMPT 6.1: Create Complete Homepage

```
Create a stunning, conversion-optimized homepage for GRATIS.NGO with all sections and animations.

### FILE: src/app/(marketing)/page.tsx
import { Metadata } from 'next';
import { HeroSection } from '@/components/marketing/HeroSection';
import { HowItWorksSection } from '@/components/marketing/HowItWorksSection';
import { ImpactStatsSection } from '@/components/marketing/ImpactStatsSection';
import { FeaturesSection } from '@/components/marketing/FeaturesSection';
import { TribePreviewSection } from '@/components/marketing/TribePreviewSection';
import { TestimonialsSection } from '@/components/marketing/TestimonialsSection';
import { PartnersSection } from '@/components/marketing/PartnersSection';
import { FAQSection } from '@/components/marketing/FAQSection';
import { CTASection } from '@/components/marketing/CTASection';

export const metadata: Metadata = {
  title: 'GRATIS.NGO - Free Premium Water Bottles | Make an Impact',
  description:
    'Get free premium water bottles delivered to your door. Join our community and make a positive impact on clean water access worldwide.',
  openGraph: {
    title: 'GRATIS.NGO - Free Premium Water Bottles',
    description: 'Join our community. Get free bottles. Make an impact.',
    images: ['/og/homepage.jpg'],
  },
};

export default function HomePage() {
  return (
    <main className="flex flex-col">
      <HeroSection />
      <HowItWorksSection />
      <ImpactStatsSection />
      <FeaturesSection />
      <TribePreviewSection />
      <TestimonialsSection />
      <PartnersSection />
      <FAQSection />
      <CTASection />
    </main>
  );
}

### FILE: src/components/marketing/HeroSection.tsx
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Icons } from '@/components/shared/Icons';
import { cn } from '@/lib/utils';

// Animated counter component
function AnimatedCounter({ target, duration = 2000, suffix = '' }: {
  target: number;
  duration?: number;
  suffix?: string;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeOutQuart * target));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [target, duration]);

  return (
    <span>
      {count.toLocaleString()}{suffix}
    </span>
  );
}

// Floating bottle animation
function FloatingBottle({ className, delay = 0 }: { className?: string; delay?: number }) {
  return (
    <motion.div
      className={cn('absolute', className)}
      initial={{ y: 0, rotate: 0 }}
      animate={{ 
        y: [-10, 10, -10],
        rotate: [-5, 5, -5],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: 'easeInOut',
        delay,
      }}
    >
      <Image
        src="/images/bottle-hero.png"
        alt="GRATIS.NGO Water Bottle"
        width={120}
        height={300}
        className="drop-shadow-2xl"
      />
    </motion.div>
  );
}

export function HeroSection() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-gratis-blue-50 via-white to-gratis-green-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-hero-pattern opacity-5" />
      
      {/* Animated Background Shapes */}
      <motion.div
        className="absolute top-20 left-10 w-64 h-64 bg-gratis-blue-200/30 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-96 h-96 bg-gratis-green-200/30 rounded-full blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 8, repeat: Infinity, delay: 1 }}
      />

      <div className="container relative z-10 py-20 lg:py-32">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20 items-center">
          {/* Left Column - Content */}
          <motion.div
            style={{ y, opacity }}
            className="space-y-8"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Badge variant="secondary" className="px-4 py-2 text-sm font-medium">
                <Icons.zap className="mr-2 h-4 w-4 text-yellow-500" />
                Over 1 Million Bottles Delivered
              </Badge>
            </motion.div>

            {/* Headline */}
            <motion.h1
              className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <span className="block">Free Premium</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-gratis-blue-600 to-gratis-green-600">
                Water Bottles
              </span>
              <span className="block text-2xl sm:text-3xl md:text-4xl font-normal text-muted-foreground mt-4">
                That Make a Real Impact
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              className="text-lg text-muted-foreground max-w-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Join thousands of people who receive free premium water bottles every month. 
              Funded by sustainable advertising, your bottles help provide clean water 
              to communities in need around the world.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Button size="lg" className="text-lg px-8 py-6" asChild>
                <Link href="/register">
                  Get Your Free Bottle
                  <Icons.arrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6" asChild>
                <Link href="/how-it-works">
                  <Icons.play className="mr-2 h-5 w-5" />
                  Watch How It Works
                </Link>
              </Button>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              className="flex flex-wrap items-center gap-6 pt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="flex items-center gap-2">
                <Icons.checkCircle className="h-5 w-5 text-green-500" />
                <span className="text-sm text-muted-foreground">100% Free</span>
              </div>
              <div className="flex items-center gap-2">
                <Icons.checkCircle className="h-5 w-5 text-green-500" />
                <span className="text-sm text-muted-foreground">No Hidden Costs</span>
              </div>
              <div className="flex items-center gap-2">
                <Icons.checkCircle className="h-5 w-5 text-green-500" />
                <span className="text-sm text-muted-foreground">ANBI Certified</span>
              </div>
            </motion.div>

            {/* Social Proof */}
            <motion.div
              className="flex items-center gap-4 pt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              {/* Avatar Stack */}
              <div className="flex -space-x-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Image
                    key={i}
                    src={`/images/avatars/user-${i}.jpg`}
                    alt={`Community member ${i}`}
                    width={40}
                    height={40}
                    className="rounded-full border-2 border-background"
                  />
                ))}
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gratis-blue-100 border-2 border-background text-xs font-semibold text-gratis-blue-600">
                  +50K
                </div>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Icons.star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  Trusted by 50,000+ members
                </span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column - Visual */}
          <motion.div
            className="relative h-[500px] lg:h-[600px]"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            {/* Central Bottle */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                animate={{ 
                  y: [-5, 5, -5],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <Image
                  src="/images/bottle-hero-main.png"
                  alt="GRATIS.NGO Premium Water Bottle"
                  width={300}
                  height={500}
                  className="drop-shadow-2xl"
                  priority
                />
              </motion.div>
            </div>

            {/* Floating Elements */}
            <FloatingBottle className="top-10 left-0 opacity-60" delay={0.5} />
            <FloatingBottle className="bottom-10 right-0 opacity-60" delay={1} />

            {/* Stats Cards */}
            <motion.div
              className="absolute top-20 right-0 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-4"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gratis-blue-100 rounded-lg">
                  <Icons.droplets className="h-6 w-6 text-gratis-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gratis-blue-600">
                    <AnimatedCounter target={2500000} suffix="L" />
                  </p>
                  <p className="text-sm text-muted-foreground">Clean Water Provided</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="absolute bottom-20 left-0 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-4"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gratis-green-100 rounded-lg">
                  <Icons.leaf className="h-6 w-6 text-gratis-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gratis-green-600">
                    <AnimatedCounter target={150000} />
                  </p>
                  <p className="text-sm text-muted-foreground">Trees Planted</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="absolute top-1/2 right-10 -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-4"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1 }}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gratis-orange-100 rounded-lg">
                  <Icons.users className="h-6 w-6 text-gratis-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gratis-orange-600">
                    <AnimatedCounter target={500000} />
                  </p>
                  <p className="text-sm text-muted-foreground">People Helped</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <Icons.chevronDown className="h-8 w-8 text-muted-foreground" />
      </motion.div>
    </section>
  );
}

### FILE: src/components/marketing/HowItWorksSection.tsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { cn } from '@/lib/utils';

const steps = [
  {
    number: '01',
    title: 'Sign Up Free',
    description: 'Create your free account in under 2 minutes. No credit card required, no hidden fees.',
    image: '/images/how-it-works/step-1.svg',
    color: 'from-gratis-blue-500 to-gratis-blue-600',
  },
  {
    number: '02',
    title: 'Choose Your Bottle',
    description: 'Browse our collection of premium designs and select your favorite water bottle each month.',
    image: '/images/how-it-works/step-2.svg',
    color: 'from-gratis-green-500 to-gratis-green-600',
  },
  {
    number: '03',
    title: 'We Ship It Free',
    description: 'Your bottle is shipped directly to your door at no cost. Advertising partners cover everything.',
    image: '/images/how-it-works/step-3.svg',
    color: 'from-gratis-orange-500 to-gratis-orange-600',
  },
  {
    number: '04',
    title: 'Make an Impact',
    description: 'Every bottle delivered funds clean water projects, helping communities access safe drinking water.',
    image: '/images/how-it-works/step-4.svg',
    color: 'from-purple-500 to-purple-600',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
};

export function HowItWorksSection() {
  return (
    <section className="py-20 lg:py-32 bg-white">
      <div className="container">
        {/* Header */}
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-sm font-semibold text-gratis-blue-600 uppercase tracking-wider">
            How It Works
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Get Your Free Bottles in{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gratis-blue-600 to-gratis-green-600">
              4 Simple Steps
            </span>
          </h2>
          <p className="mt-6 text-lg text-muted-foreground">
            Our unique model uses sustainable advertising to fund free premium water bottles 
            for you while creating positive impact worldwide.
          </p>
        </motion.div>

        {/* Steps Grid */}
        <motion.div
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              variants={itemVariants}
              className="relative group"
            >
              {/* Connector Line (except last) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-[60%] w-full h-0.5 bg-gradient-to-r from-gray-200 to-transparent" />
              )}

              <div className="relative bg-gray-50 rounded-2xl p-8 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                {/* Step Number */}
                <div
                  className={cn(
                    'inline-flex items-center justify-center w-12 h-12 rounded-xl text-white font-bold text-lg bg-gradient-to-br',
                    step.color
                  )}
                >
                  {step.number}
                </div>

                {/* Image */}
                <div className="mt-6 mb-6 h-40 flex items-center justify-center">
                  <Image
                    src={step.image}
                    alt={step.title}
                    width={160}
                    height={160}
                    className="object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <p className="text-lg text-muted-foreground mb-6">
            Ready to join 50,000+ members making a difference?
          </p>
          <a
            href="/register"
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-gratis-blue-600 to-gratis-green-600 rounded-full hover:opacity-90 transition-opacity"
          >
            Start Now – It's Free
            <svg
              className="ml-2 w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  );
}

### FILE: src/components/marketing/ImpactStatsSection.tsx
'use client';

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import CountUp from 'react-countup';
import { Icons } from '@/components/shared/Icons';
import { cn } from '@/lib/utils';

const stats = [
  {
    icon: Icons.droplets,
    value: 2500000,
    suffix: 'L',
    label: 'Clean Water Provided',
    description: 'Liters of clean drinking water funded through our projects',
    color: 'text-gratis-blue-600',
    bgColor: 'bg-gratis-blue-100',
  },
  {
    icon: Icons.users,
    value: 500000,
    suffix: '+',
    label: 'People Helped',
    description: 'Individuals with improved access to clean water',
    color: 'text-gratis-green-600',
    bgColor: 'bg-gratis-green-100',
  },
  {
    icon: Icons.leaf,
    value: 150000,
    suffix: '',
    label: 'Trees Planted',
    description: 'Contributing to reforestation and carbon offset',
    color: 'text-gratis-orange-600',
    bgColor: 'bg-gratis-orange-100',
  },
  {
    icon: Icons.gift,
    value: 1000000,
    suffix: '+',
    label: 'Bottles Delivered',
    description: 'Free premium water bottles shipped worldwide',
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
  },
];

export function ImpactStatsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="py-20 lg:py-32 bg-gradient-to-br from-gray-900 to-gray-800 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Animated Blobs */}
      <motion.div
        className="absolute top-0 left-0 w-96 h-96 bg-gratis-blue-500/20 rounded-full blur-3xl"
        animate={{
          x: [0, 50, 0],
          y: [0, 30, 0],
        }}
        transition={{ duration: 10, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-0 right-0 w-96 h-96 bg-gratis-green-500/20 rounded-full blur-3xl"
        animate={{
          x: [0, -50, 0],
          y: [0, -30, 0],
        }}
        transition={{ duration: 10, repeat: Infinity, delay: 2 }}
      />

      <div className="container relative z-10">
        {/* Header */}
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-sm font-semibold text-gratis-blue-400 uppercase tracking-wider">
            Our Impact
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Together, We're Making a{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gratis-blue-400 to-gratis-green-400">
              Real Difference
            </span>
          </h2>
          <p className="mt-6 text-lg text-gray-300">
            Every bottle delivered contributes to our global mission of providing 
            clean water access and creating sustainable change.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div ref={ref} className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 text-center hover:bg-white/10 transition-colors"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              {/* Icon */}
              <div className={cn('inline-flex p-4 rounded-xl mb-6', stat.bgColor)}>
                <stat.icon className={cn('w-8 h-8', stat.color)} />
              </div>

              {/* Number */}
              <div className="text-4xl lg:text-5xl font-bold mb-2">
                {isInView ? (
                  <CountUp
                    end={stat.value}
                    duration={2.5}
                    separator=","
                    suffix={stat.suffix}
                  />
                ) : (
                  `0${stat.suffix}`
                )}
              </div>

              {/* Label */}
              <h3 className="text-xl font-semibold mb-2">{stat.label}</h3>
              
              {/* Description */}
              <p className="text-gray-400 text-sm">{stat.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Bottom Message */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <p className="text-gray-300 mb-4">
            Updated in real-time • Last verified: January 2026
          </p>
          <a
            href="/impact/reports"
            className="inline-flex items-center text-gratis-blue-400 hover:text-gratis-blue-300 font-medium"
          >
            View Full Impact Report
            <Icons.arrowRight className="ml-2 h-4 w-4" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}

### FILE: src/components/marketing/TestimonialsSection.tsx
'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Icons } from '@/components/shared/Icons';
import { cn } from '@/lib/utils';

const testimonials = [
  {
    id: 1,
    name: 'Sarah van der Berg',
    role: 'TRIBE Champion Member',
    location: 'Amsterdam, Netherlands',
    avatar: '/images/testimonials/sarah.jpg',
    content:
      "I was skeptical at first - free bottles with no catch? But it's real! I've received 12 beautiful bottles and love knowing my participation helps fund clean water projects. The TRIBE membership adds even more perks.",
    rating: 5,
    tier: 'champion',
    bottlesReceived: 12,
  },
  {
    id: 2,
    name: 'Marcus Schmidt',
    role: 'Environmental Advocate',
    location: 'Berlin, Germany',
    avatar: '/images/testimonials/marcus.jpg',
    content:
      "As someone passionate about sustainability, GRATIS.NGO aligns perfectly with my values. The bottles are high quality, and the impact reporting is transparent. I can actually see where my contribution goes.",
    rating: 5,
    tier: 'legend',
    bottlesReceived: 24,
  },
  {
    id: 3,
    name: 'Emma Laurent',
    role: 'Marketing Manager',
    location: 'Brussels, Belgium',
    avatar: '/images/testimonials/emma.jpg',
    content:
      "The community aspect surprised me the most. Events, voting on projects, connecting with like-minded people - it's more than just free bottles. It's a movement I'm proud to be part of.",
    rating: 5,
    tier: 'supporter',
    bottlesReceived: 8,
  },
  {
    id: 4,
    name: 'Jan de Vries',
    role: 'Teacher',
    location: 'Rotterdam, Netherlands',
    avatar: '/images/testimonials/jan.jpg',
    content:
      "I introduced GRATIS.NGO to my students as an example of innovative social enterprise. Now our whole class participates, and the kids love tracking the impact their bottles create.",
    rating: 5,
    tier: 'free',
    bottlesReceived: 6,
  },
];

const tierColors = {
  free: 'bg-gray-100 text-gray-700',
  supporter: 'bg-gratis-blue-100 text-gratis-blue-700',
  champion: 'bg-purple-100 text-purple-700',
  legend: 'bg-amber-100 text-amber-700',
};

export function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeTestimonial = testimonials[activeIndex];

  return (
    <section className="py-20 lg:py-32 bg-gray-50">
      <div className="container">
        {/* Header */}
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-sm font-semibold text-gratis-blue-600 uppercase tracking-wider">
            Community Stories
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Loved by{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gratis-blue-600 to-gratis-green-600">
              50,000+ Members
            </span>
          </h2>
          <p className="mt-6 text-lg text-muted-foreground">
            Real stories from real people making a difference with GRATIS.NGO
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {/* Main Testimonial Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTestimonial.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-3xl shadow-xl p-8 lg:p-12"
            >
              {/* Quote */}
              <div className="relative">
                <Icons.quote className="absolute -top-4 -left-4 w-12 h-12 text-gratis-blue-100" />
                <p className="text-lg lg:text-xl text-gray-700 leading-relaxed pl-8">
                  "{activeTestimonial.content}"
                </p>
              </div>

              {/* Author */}
              <div className="mt-8 flex items-center justify-between flex-wrap gap-6">
                <div className="flex items-center gap-4">
                  <Image
                    src={activeTestimonial.avatar}
                    alt={activeTestimonial.name}
                    width={64}
                    height={64}
                    className="rounded-full"
                  />
                  <div>
                    <h4 className="font-semibold text-lg">{activeTestimonial.name}</h4>
                    <p className="text-muted-foreground">{activeTestimonial.role}</p>
                    <p className="text-sm text-muted-foreground">
                      📍 {activeTestimonial.location}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {/* Tier Badge */}
                  <span
                    className={cn(
                      'px-3 py-1 rounded-full text-sm font-medium capitalize',
                      tierColors[activeTestimonial.tier]
                    )}
                  >
                    {activeTestimonial.tier} Member
                  </span>

                  {/* Bottles Count */}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Icons.droplets className="w-4 h-4 text-gratis-blue-500" />
                    {activeTestimonial.bottlesReceived} bottles received
                  </div>

                  {/* Rating */}
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Icons.star
                        key={i}
                        className={cn(
                          'w-5 h-5',
                          i < activeTestimonial.rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-200'
                        )}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Dots & Arrows */}
          <div className="flex items-center justify-center gap-6 mt-8">
            <button
              onClick={() =>
                setActiveIndex((prev) =>
                  prev === 0 ? testimonials.length - 1 : prev - 1
                )
              }
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Previous testimonial"
            >
              <Icons.chevronLeft className="w-6 h-6" />
            </button>

            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={cn(
                    'w-3 h-3 rounded-full transition-all',
                    index === activeIndex
                      ? 'bg-gratis-blue-600 w-8'
                      : 'bg-gray-300 hover:bg-gray-400'
                  )}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={() =>
                setActiveIndex((prev) =>
                  prev === testimonials.length - 1 ? 0 : prev + 1
                )
              }
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Next testimonial"
            >
              <Icons.chevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
```

---

# ═══════════════════════════════════════════════════════════════════════════════
# SECTION 7: USER DASHBOARD
# ═══════════════════════════════════════════════════════════════════════════════

## PROMPT 7.1: Create Dashboard Layout & Overview Page

```
Create the complete user dashboard with sidebar navigation, overview page, and all widgets.

### FILE: src/app/(dashboard)/layout.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRequireAuth } from '@/lib/auth/useRequireAuth';
import { Logo } from '@/components/shared/Logo';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Icons } from '@/components/shared/Icons';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/auth/AuthContext';

// Dashboard navigation items
const navigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: Icons.home,
    badge: null,
  },
  {
    name: 'My Bottles',
    href: '/bottles',
    icon: Icons.droplets,
    badge: null,
  },
  {
    name: 'My Impact',
    href: '/impact',
    icon: Icons.leaf,
    badge: null,
  },
  {
    name: 'TRIBE',
    href: '/tribe',
    icon: Icons.trophy,
    badge: 'Pro',
  },
  {
    name: 'Events',
    href: '/events',
    icon: Icons.calendar,
    badge: '2',
  },
  {
    name: 'Donations',
    href: '/donations',
    icon: Icons.heart,
    badge: null,
  },
  {
    name: 'Shop',
    href: '/shop',
    icon: Icons.gift,
    badge: 'New',
  },
];

const secondaryNavigation = [
  {
    name: 'Profile',
    href: '/profile',
    icon: Icons.user,
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: Icons.settings,
  },
  {
    name: 'Notifications',
    href: '/notifications',
    icon: Icons.bell,
  },
  {
    name: 'Help & Support',
    href: '/help',
    icon: Icons.info,
  },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { user, signOut, isLoading } = useAuth();
  
  // Require authentication
  const { isAuthorized } = useRequireAuth();

  if (isLoading || !isAuthorized) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Icons.spinner className="h-8 w-8 animate-spin text-gratis-blue-600" />
      </div>
    );
  }

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex h-16 shrink-0 items-center px-6 border-b">
        <Link href="/" className="flex items-center gap-2">
          <Logo className="h-8 w-auto" />
        </Link>
      </div>

      {/* User Info */}
      <div className="p-4 border-b">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user?.avatar} />
            <AvatarFallback>
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.displayName}</p>
            <Badge variant="outline" className="text-xs capitalize">
              {user?.tribeMembership.tier} Member
            </Badge>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="bg-gratis-blue-50 rounded-lg p-2 text-center">
            <p className="text-lg font-bold text-gratis-blue-600">
              {user?.stats.currentMonthBottles || 0}/{user?.stats.monthlyBottleAllowance || 1}
            </p>
            <p className="text-xs text-muted-foreground">Bottles</p>
          </div>
          <div className="bg-gratis-green-50 rounded-lg p-2 text-center">
            <p className="text-lg font-bold text-gratis-green-600">
              {user?.stats.impactScore || 0}
            </p>
            <p className="text-xs text-muted-foreground">Impact</p>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-gratis-blue-100 text-gratis-blue-700'
                    : 'text-muted-foreground hover:bg-gray-100 hover:text-foreground'
                )}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className="h-5 w-5" />
                <span className="flex-1">{item.name}</span>
                {item.badge && (
                  <Badge
                    variant={item.badge === 'New' ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {item.badge}
                  </Badge>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="mt-8">
          <p className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Account
          </p>
          <nav className="space-y-1">
            {secondaryNavigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-gray-100 text-foreground'
                      : 'text-muted-foreground hover:bg-gray-100 hover:text-foreground'
                  )}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </ScrollArea>

      {/* Upgrade CTA (for free users) */}
      {user?.tribeMembership.tier === 'free' && (
        <div className="p-4 border-t">
          <div className="bg-gradient-to-r from-gratis-blue-600 to-gratis-green-600 rounded-lg p-4 text-white">
            <h4 className="font-semibold">Upgrade to TRIBE</h4>
            <p className="text-sm opacity-90 mt-1">
              Get more bottles & exclusive benefits
            </p>
            <Button
              size="sm"
              variant="secondary"
              className="mt-3 w-full"
              asChild
            >
              <Link href="/tribe">View Plans</Link>
            </Button>
          </div>
        </div>
      )}

      {/* Sign Out */}
      <div className="p-4 border-t">
        <Button
          variant="ghost"
          className="w-full justify-start text-muted-foreground hover:text-destructive"
          onClick={() => signOut()}
        >
          <Icons.logOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex w-64 flex-col border-r bg-white">
          <SidebarContent />
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Header */}
        <header className="flex h-16 items-center gap-4 border-b bg-white px-4 lg:px-8">
          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Icons.menu className="h-5 w-5" />
          </Button>

          {/* Breadcrumb / Page Title */}
          <div className="flex-1">
            <h1 className="text-lg font-semibold capitalize">
              {pathname.split('/').pop() || 'Dashboard'}
            </h1>
          </div>

          {/* Header Actions */}
          <div className="flex items-center gap-4">
            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative" asChild>
              <Link href="/notifications">
                <Icons.bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
                  3
                </span>
              </Link>
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={user?.avatar} />
                    <AvatarFallback>
                      {user?.firstName?.[0]}{user?.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{user?.displayName}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile">
                    <Icons.user className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings">
                    <Icons.settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => signOut()}
                  className="text-destructive focus:text-destructive"
                >
                  <Icons.logOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

### FILE: src/app/(dashboard)/dashboard/page.tsx
import { Metadata } from 'next';
import { DashboardOverview } from '@/components/dashboard/DashboardOverview';

export const metadata: Metadata = {
  title: 'Dashboard | GRATIS.NGO',
  description: 'Your GRATIS.NGO dashboard - track bottles, impact, and more.',
};

export default function DashboardPage() {
  return <DashboardOverview />;
}

### FILE: src/components/dashboard/DashboardOverview.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/auth/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Icons } from '@/components/shared/Icons';
import { cn, formatNumber, formatCurrency } from '@/lib/utils';

export function DashboardOverview() {
  const { user } = useAuth();

  if (!user) return null;

  const bottleProgress = (user.stats.currentMonthBottles / user.stats.monthlyBottleAllowance) * 100;
  const bottlesRemaining = user.stats.monthlyBottleAllowance - user.stats.currentMonthBottles;

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-gratis-blue-600 to-gratis-green-600 p-6 lg:p-8 text-white"
      >
        <div className="relative z-10">
          <h1 className="text-2xl lg:text-3xl font-bold">
            Welcome back, {user.firstName}! 👋
          </h1>
          <p className="mt-2 text-white/80 max-w-xl">
            You've made an incredible impact. Keep going to unlock more achievements and help
            more communities access clean water.
          </p>
          
          {/* Quick Actions */}
          <div className="mt-6 flex flex-wrap gap-3">
            <Button variant="secondary" asChild>
              <Link href="/bottles/order">
                <Icons.droplets className="mr-2 h-4 w-4" />
                Order Bottle
              </Link>
            </Button>
            <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20" asChild>
              <Link href="/impact">
                View My Impact
                <Icons.arrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute -right-5 -bottom-5 w-32 h-32 bg-white/10 rounded-full blur-xl" />
      </motion.div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Monthly Bottles */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Bottles</CardTitle>
              <Icons.droplets className="h-4 w-4 text-gratis-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {user.stats.currentMonthBottles}/{user.stats.monthlyBottleAllowance}
              </div>
              <Progress value={bottleProgress} className="mt-2 h-2" />
              <p className="text-xs text-muted-foreground mt-2">
                {bottlesRemaining > 0 
                  ? `${bottlesRemaining} bottle${bottlesRemaining > 1 ? 's' : ''} remaining this month`
                  : 'Monthly limit reached'}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Impact Score */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Impact Score</CardTitle>
              <Icons.zap className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(user.stats.impactScore)}</div>
              <div className="flex items-center mt-2">
                <Icons.trendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-xs text-green-500 font-medium">+12% this month</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Rank #{Math.floor(Math.random() * 1000) + 1} in your region
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Water Donated */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Water Donated</CardTitle>
              <Icons.droplets className="h-4 w-4 text-gratis-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(user.stats.totalWaterDonated)}L</div>
              <p className="text-xs text-muted-foreground mt-2">
                Enough for {Math.floor(user.stats.totalWaterDonated / 2)} people for a day
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Trees Planted */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Trees Planted</CardTitle>
              <Icons.leaf className="h-4 w-4 text-gratis-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(user.stats.totalTreesPlanted)}</div>
              <p className="text-xs text-muted-foreground mt-2">
                Offsetting {formatNumber(user.stats.totalCO2Offset)}kg CO₂
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Orders */}
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Orders</CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/bottles/orders">View All</Link>
                </Button>
              </div>
              <CardDescription>Your latest bottle orders and their status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Sample Order Items */}
                {[
                  { id: 'GRT-2026-001234', status: 'shipped', date: '2 days ago', bottles: 2 },
                  { id: 'GRT-2026-001189', status: 'delivered', date: '1 week ago', bottles: 1 },
                  { id: 'GRT-2025-012456', status: 'delivered', date: '1 month ago', bottles: 3 },
                ].map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-white rounded-lg shadow-sm">
                        <Icons.droplets className="h-6 w-6 text-gratis-blue-500" />
                      </div>
                      <div>
                        <p className="font-medium">{order.id}</p>
                        <p className="text-sm text-muted-foreground">
                          {order.bottles} bottle{order.bottles > 1 ? 's' : ''} • {order.date}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant={order.status === 'delivered' ? 'secondary' : 'default'}
                      className={cn(
                        order.status === 'shipped' && 'bg-blue-100 text-blue-700 hover:bg-blue-100',
                        order.status === 'delivered' && 'bg-green-100 text-green-700 hover:bg-green-100'
                      )}
                    >
                      {order.status === 'shipped' && <Icons.truck className="mr-1 h-3 w-3" />}
                      {order.status === 'delivered' && <Icons.check className="mr-1 h-3 w-3" />}
                      {order.status}
                    </Badge>
                  </div>
                ))}

                {/* Order CTA */}
                {bottlesRemaining > 0 && (
                  <Button className="w-full mt-4" asChild>
                    <Link href="/bottles/order">
                      <Icons.plus className="mr-2 h-4 w-4" />
                      Order Your {bottlesRemaining > 1 ? 'Next' : ''} Bottle
                    </Link>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Achievements & TRIBE */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="space-y-6"
        >
          {/* TRIBE Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icons.trophy className="h-5 w-5 text-yellow-500" />
                TRIBE Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <Badge
                  className={cn(
                    'text-lg px-4 py-2',
                    user.tribeMembership.tier === 'free' && 'bg-gray-100 text-gray-700',
                    user.tribeMembership.tier === 'supporter' && 'bg-blue-100 text-blue-700',
                    user.tribeMembership.tier === 'champion' && 'bg-purple-100 text-purple-700',
                    user.tribeMembership.tier === 'legend' && 'bg-amber-100 text-amber-700'
                  )}
                >
                  {user.tribeMembership.tier.charAt(0).toUpperCase() + user.tribeMembership.tier.slice(1)}
                </Badge>

                {user.tribeMembership.tier === 'free' && (
                  <div className="mt-4">
                    <p className="text-sm text-muted-foreground mb-3">
                      Upgrade to unlock more bottles & exclusive benefits
                    </p>
                    <Button size="sm" className="w-full" asChild>
                      <Link href="/tribe">Explore TRIBE</Link>
                    </Button>
                  </div>
                )}

                {user.tribeMembership.tier !== 'free' && (
                  <div className="mt-4 text-sm text-muted-foreground">
                    <p>Next billing: Feb 1, 2026</p>
                    <p className="font-medium text-foreground">
                      {user.tribeMembership.tier === 'supporter' && '€9.99/month'}
                      {user.tribeMembership.tier === 'champion' && '€19.99/month'}
                      {user.tribeMembership.tier === 'legend' && '€49.99/month'}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Achievements */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Achievements</CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/profile#achievements">View All</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {(user.achievements.slice(0, 3) || [
                  { name: 'First Bottle', icon: '🍼', tier: 'bronze' },
                  { name: 'Impact Starter', icon: '💧', tier: 'silver' },
                  { name: 'Community Hero', icon: '🦸', tier: 'gold' },
                ]).map((achievement, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 rounded-lg bg-gray-50"
                  >
                    <span className="text-2xl">{achievement.icon}</span>
                    <div className="flex-1">
                      <p className="font-medium">{achievement.name}</p>
                      <p className="text-xs text-muted-foreground capitalize">{achievement.tier}</p>
                    </div>
                    {achievement.isNew && (
                      <Badge variant="default" className="text-xs">New!</Badge>
                    )}
                  </div>
                ))}

                {user.achievements.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Order your first bottle to unlock achievements!
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Upcoming Events */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Upcoming Events</CardTitle>
                <CardDescription>Join community events and make a bigger impact</CardDescription>
              </div>
              <Button variant="outline" asChild>
                <Link href="/events">Browse Events</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {/* Sample Events */}
              {[
                {
                  title: 'Clean Water Workshop',
                  date: 'Feb 15, 2026',
                  location: 'Amsterdam',
                  attendees: 45,
                  image: '/images/events/workshop.jpg',
                },
                {
                  title: 'TRIBE Member Meetup',
                  date: 'Feb 22, 2026',
                  location: 'Online',
                  attendees: 128,
                  image: '/images/events/meetup.jpg',
                },
                {
                  title: 'Impact Report Launch',
                  date: 'Mar 1, 2026',
                  location: 'Rotterdam',
                  attendees: 89,
                  image: '/images/events/launch.jpg',
                },
              ].map((event, i) => (
                <div
                  key={i}
                  className="group relative overflow-hidden rounded-xl border hover:shadow-lg transition-shadow"
                >
                  <div className="aspect-video bg-gray-100 relative">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-3 left-3 text-white">
                      <p className="font-semibold">{event.title}</p>
                      <div className="flex items-center gap-2 text-sm opacity-90">
                        <Icons.calendar className="h-3 w-3" />
                        {event.date}
                      </div>
                    </div>
                  </div>
                  <div className="p-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <Icons.mapPin className="h-3 w-3" />
                        {event.location}
                      </span>
                      <span className="text-muted-foreground flex items-center gap-1">
                        <Icons.users className="h-3 w-3" />
                        {event.attendees} going
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
```

---

# ═══════════════════════════════════════════════════════════════════════════════
# SECTION 8: BOTTLE SYSTEM
# ═══════════════════════════════════════════════════════════════════════════════

## PROMPT 8.1: Create Bottle Selection & Ordering System

```
Create the complete bottle selection, customization, and ordering system.

### FILE: src/app/(dashboard)/bottles/page.tsx
import { Metadata } from 'next';
import { BottleGallery } from '@/components/bottles/BottleGallery';

export const metadata: Metadata = {
  title: 'My Bottles | GRATIS.NGO',
  description: 'Browse and order your free premium water bottles',
};

export default function BottlesPage() {
  return <BottleGallery />;
}

### FILE: src/components/bottles/BottleGallery.tsx
'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/lib/auth/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Icons } from '@/components/shared/Icons';
import { cn } from '@/lib/utils';
import type { BottleDesign, BottleDesignCategory } from '@/types';

// Mock bottle designs data
const mockBottleDesigns: BottleDesign[] = [
  {
    id: '1',
    name: 'Ocean Wave',
    slug: 'ocean-wave',
    description: 'Inspired by the endless waves of the ocean',
    category: 'standard',
    tags: ['nature', 'blue', 'water'],
    images: {
      main: '/images/bottles/ocean-wave.png',
      thumbnail: '/images/bottles/ocean-wave-thumb.png',
      gallery: [],
    },
    colors: ['#3B82F6', '#60A5FA', '#BFDBFE'],
    availableSizes: ['small', 'medium', 'large'],
    minTier: 'free',
    isActive: true,
    isLimited: false,
    orderedCount: 15420,
    viewCount: 45000,
    favoriteCount: 2100,
    createdAt: new Date() as any,
    updatedAt: new Date() as any,
  },
  {
    id: '2',
    name: 'Forest Green',
    slug: 'forest-green',
    description: 'Deep greens inspired by ancient forests',
    category: 'standard',
    tags: ['nature', 'green', 'earth'],
    images: {
      main: '/images/bottles/forest-green.png',
      thumbnail: '/images/bottles/forest-green-thumb.png',
      gallery: [],
    },
    colors: ['#22C55E', '#16A34A', '#15803D'],
    availableSizes: ['small', 'medium', 'large'],
    minTier: 'free',
    isActive: true,
    isLimited: false,
    orderedCount: 12350,
    viewCount: 38000,
    favoriteCount: 1890,
    createdAt: new Date() as any,
    updatedAt: new Date() as any,
  },
  {
    id: '3',
    name: 'Sunset Glow',
    slug: 'sunset-glow',
    description: 'Warm colors of a beautiful sunset',
    category: 'seasonal',
    tags: ['warm', 'orange', 'summer'],
    images: {
      main: '/images/bottles/sunset-glow.png',
      thumbnail: '/images/bottles/sunset-glow-thumb.png',
      gallery: [],
    },
    colors: ['#F97316', '#FB923C', '#FDBA74'],
    availableSizes: ['medium', 'large'],
    minTier: 'supporter',
    isActive: true,
    isLimited: true,
    limitedQuantity: 5000,
    quantityRemaining: 1234,
    orderedCount: 3766,
    viewCount: 25000,
    favoriteCount: 980,
    createdAt: new Date() as any,
    updatedAt: new Date() as any,
  },
  {
    id: '4',
    name: 'TRIBE Legend',
    slug: 'tribe-legend',
    description: 'Exclusive design for TRIBE Legend members',
    category: 'tribe_exclusive',
    tags: ['exclusive', 'gold', 'premium'],
    images: {
      main: '/images/bottles/tribe-legend.png',
      thumbnail: '/images/bottles/tribe-legend-thumb.png',
      gallery: [],
    },
    colors: ['#F59E0B', '#D97706', '#B45309'],
    availableSizes: ['medium', 'large'],
    minTier: 'legend',
    isActive: true,
    isLimited: false,
    orderedCount: 890,
    viewCount: 8500,
    favoriteCount: 456,
    createdAt: new Date() as any,
    updatedAt: new Date() as any,
  },
  // Add more designs...
];

const categories = [
  { value: 'all', label: 'All Designs' },
  { value: 'standard', label: 'Standard' },
  { value: 'seasonal', label: 'Seasonal' },
  { value: 'limited_edition', label: 'Limited Edition' },
  { value: 'tribe_exclusive', label: 'TRIBE Exclusive' },
];

const sortOptions = [
  { value: 'popular', label: 'Most Popular' },
  { value: 'newest', label: 'Newest First' },
  { value: 'name', label: 'Name A-Z' },
];

const tierOrder = { free: 0, supporter: 1, champion: 2, legend: 3 };

export function BottleGallery() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState('popular');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Filter and sort bottles
  const filteredBottles = useMemo(() => {
    let bottles = [...mockBottleDesigns];

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      bottles = bottles.filter(
        (b) =>
          b.name.toLowerCase().includes(query) ||
          b.description.toLowerCase().includes(query) ||
          b.tags.some((t) => t.toLowerCase().includes(query))
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      bottles = bottles.filter((b) => b.category === selectedCategory);
    }

    // Sort
    switch (sortBy) {
      case 'popular':
        bottles.sort((a, b) => b.orderedCount - a.orderedCount);
        break;
      case 'newest':
        bottles.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        break;
      case 'name':
        bottles.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return bottles;
  }, [searchQuery, selectedCategory, sortBy]);

  // Check if user can order a design
  const canOrder = (design: BottleDesign): boolean => {
    if (!user) return false;
    const userTierLevel = tierOrder[user.tribeMembership.tier as keyof typeof tierOrder];
    const requiredTierLevel = tierOrder[design.minTier as keyof typeof tierOrder];
    return userTierLevel >= requiredTierLevel;
  };

  const bottlesRemaining = user 
    ? user.stats.monthlyBottleAllowance - user.stats.currentMonthBottles 
    : 0;
  const bottleProgress = user 
    ? (user.stats.currentMonthBottles / user.stats.monthlyBottleAllowance) * 100 
    : 0;

  return (
    <div className="space-y-8">
      {/* Header with Allowance Status */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-bold">Bottle Collection</h1>
          <p className="text-muted-foreground">
            Choose your free premium water bottles
          </p>
        </div>

        {/* Monthly Allowance Card */}
        <Card className="w-full lg:w-auto">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gratis-blue-100 rounded-xl">
                <Icons.droplets className="h-6 w-6 text-gratis-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Monthly Allowance</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold">
                    {user?.stats.currentMonthBottles || 0}
                  </span>
                  <span className="text-muted-foreground">
                    / {user?.stats.monthlyBottleAllowance || 1}
                  </span>
                </div>
                <Progress value={bottleProgress} className="mt-2 h-2" />
              </div>
              {bottlesRemaining > 0 && (
                <Badge variant="secondary" className="whitespace-nowrap">
                  {bottlesRemaining} left
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Icons.search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search designs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Category Tabs */}
        <Tabs
          value={selectedCategory}
          onValueChange={setSelectedCategory}
          className="w-full sm:w-auto"
        >
          <TabsList className="grid w-full grid-cols-5 sm:w-auto">
            {categories.map((cat) => (
              <TabsTrigger key={cat.value} value={cat.value} className="text-xs sm:text-sm">
                {cat.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Sort & View Mode */}
        <div className="flex gap-2">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex border rounded-md">
            <Button
              variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
              size="icon"
              onClick={() => setViewMode('grid')}
            >
              <Icons.grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'secondary' : 'ghost'}
              size="icon"
              onClick={() => setViewMode('list')}
            >
              <Icons.list className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <p className="text-sm text-muted-foreground">
        Showing {filteredBottles.length} design{filteredBottles.length !== 1 ? 's' : ''}
      </p>

      {/* Bottle Grid */}
      <motion.div
        layout
        className={cn(
          'grid gap-6',
          viewMode === 'grid'
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
            : 'grid-cols-1'
        )}
      >
        <AnimatePresence mode="popLayout">
          {filteredBottles.map((bottle) => (
            <BottleCard
              key={bottle.id}
              bottle={bottle}
              viewMode={viewMode}
              canOrder={canOrder(bottle)}
              userTier={user?.tribeMembership.tier || 'free'}
            />
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Empty State */}
      {filteredBottles.length === 0 && (
        <div className="text-center py-12">
          <Icons.droplets className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold">No designs found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search or filters
          </p>
        </div>
      )}
    </div>
  );
}

// Bottle Card Component
function BottleCard({
  bottle,
  viewMode,
  canOrder,
  userTier,
}: {
  bottle: BottleDesign;
  viewMode: 'grid' | 'list';
  canOrder: boolean;
  userTier: string;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  const tierBadgeColors: Record<string, string> = {
    free: 'bg-gray-100 text-gray-700',
    supporter: 'bg-blue-100 text-blue-700',
    champion: 'bg-purple-100 text-purple-700',
    legend: 'bg-amber-100 text-amber-700',
  };

  if (viewMode === 'list') {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
      >
        <Card className="overflow-hidden hover:shadow-lg transition-shadow">
          <CardContent className="p-0">
            <div className="flex gap-6">
              {/* Image */}
              <div className="relative w-40 h-40 bg-gray-50 flex-shrink-0">
                <Image
                  src={bottle.images.main}
                  alt={bottle.name}
                  fill
                  className="object-contain p-4"
                />
                {bottle.isLimited && (
                  <Badge className="absolute top-2 left-2 bg-red-500">
                    Limited
                  </Badge>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 py-4 pr-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">{bottle.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {bottle.description}
                    </p>
                  </div>
                  <Badge className={cn('ml-2', tierBadgeColors[bottle.minTier])}>
                    {bottle.minTier}
                  </Badge>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Icons.users className="h-4 w-4" />
                    {bottle.orderedCount.toLocaleString()} ordered
                  </span>
                  <span className="flex items-center gap-1">
                    <Icons.heart className="h-4 w-4" />
                    {bottle.favoriteCount.toLocaleString()}
                  </span>
                </div>

                {/* Limited Progress */}
                {bottle.isLimited && bottle.limitedQuantity && bottle.quantityRemaining && (
                  <div className="mt-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Remaining</span>
                      <span className="font-medium">
                        {bottle.quantityRemaining.toLocaleString()} / {bottle.limitedQuantity.toLocaleString()}
                      </span>
                    </div>
                    <Progress
                      value={(bottle.quantityRemaining / bottle.limitedQuantity) * 100}
                      className="h-2"
                    />
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2 mt-4">
                  {canOrder ? (
                    <Button asChild>
                      <Link href={`/bottles/${bottle.slug}/order`}>
                        Order Now
                      </Link>
                    </Button>
                  ) : (
                    <Button disabled>
                      <Icons.lock className="mr-2 h-4 w-4" />
                      {bottle.minTier} only
                    </Button>
                  )}
                  <Button variant="outline" size="icon">
                    <Icons.heart
                      className={cn(
                        'h-4 w-4',
                        isFavorited && 'fill-red-500 text-red-500'
                      )}
                    />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300">
        {/* Image Container */}
        <div className="relative aspect-[3/4] bg-gradient-to-b from-gray-50 to-gray-100 overflow-hidden">
          <motion.div
            animate={{ scale: isHovered ? 1.05 : 1 }}
            transition={{ duration: 0.3 }}
            className="relative h-full"
          >
            <Image
              src={bottle.images.main}
              alt={bottle.name}
              fill
              className="object-contain p-6"
            />
          </motion.div>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {bottle.isLimited && (
              <Badge className="bg-red-500 hover:bg-red-600">
                <Icons.clock className="mr-1 h-3 w-3" />
                Limited
              </Badge>
            )}
            {bottle.minTier !== 'free' && (
              <Badge className={tierBadgeColors[bottle.minTier]}>
                {bottle.minTier}
              </Badge>
            )}
          </div>

          {/* Favorite Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm hover:bg-white"
            onClick={(e) => {
              e.preventDefault();
              setIsFavorited(!isFavorited);
            }}
          >
            <Icons.heart
              className={cn(
                'h-4 w-4 transition-colors',
                isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-600'
              )}
            />
          </Button>

          {/* Quick Order Overlay */}
          <motion.div
            className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/70 to-transparent"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
          >
            {canOrder ? (
              <Button className="w-full" asChild>
                <Link href={`/bottles/${bottle.slug}/order`}>
                  Select & Order
                </Link>
              </Button>
            ) : (
              <Button className="w-full" variant="secondary" asChild>
                <Link href="/tribe">
                  <Icons.lock className="mr-2 h-4 w-4" />
                  Upgrade to {bottle.minTier}
                </Link>
              </Button>
            )}
          </motion.div>
        </div>

        {/* Content */}
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold group-hover:text-gratis-blue-600 transition-colors">
                {bottle.name}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-1">
                {bottle.description}
              </p>
            </div>
          </div>

          {/* Color Swatches */}
          <div className="flex gap-1 mt-3">
            {bottle.colors.map((color, i) => (
              <div
                key={i}
                className="w-4 h-4 rounded-full border border-gray-200"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Icons.users className="h-4 w-4" />
              {bottle.orderedCount.toLocaleString()}
            </span>
            <span className="flex items-center gap-1">
              <Icons.heart className="h-4 w-4" />
              {bottle.favoriteCount.toLocaleString()}
            </span>
            {bottle.isLimited && bottle.quantityRemaining && (
              <span className="text-red-500 font-medium">
                {bottle.quantityRemaining} left
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
```

---

# ═══════════════════════════════════════════════════════════════════════════════
# SECTION 9: EVENTS SYSTEM
# ═══════════════════════════════════════════════════════════════════════════════

## PROMPT 9.1: Create Events Listing & Registration System

```
Create the complete events listing, detail pages, and registration system.

### FILE: src/app/(dashboard)/events/page.tsx
import { Metadata } from 'next';
import { EventsListing } from '@/components/events/EventsListing';

export const metadata: Metadata = {
  title: 'Events | GRATIS.NGO',
  description: 'Join community events, workshops, and meetups',
};

export default function EventsPage() {
  return <EventsListing />;
}

### FILE: src/components/events/EventsListing.tsx
'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { format, isFuture, isPast, isToday, isTomorrow, isThisWeek, isThisMonth } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Icons } from '@/components/shared/Icons';
import { cn, formatDate } from '@/lib/utils';
import type { Event, EventType, EventFormat } from '@/types';

// Mock events data
const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Clean Water Workshop',
    slug: 'clean-water-workshop-amsterdam',
    description: 'Learn about water purification techniques and how GRATIS.NGO projects are making a difference in communities worldwide.',
    shortDescription: 'Hands-on workshop about water purification',
    type: 'workshop',
    format: 'in_person',
    status: 'published',
    coverImage: '/images/events/workshop-cover.jpg',
    thumbnailImage: '/images/events/workshop-thumb.jpg',
    location: {
      type: 'physical',
      name: 'GRATIS.NGO HQ',
      address: 'Herengracht 420',
      city: 'Amsterdam',
      country: 'Netherlands',
      postalCode: '1017 BZ',
    },
    startDate: new Date('2026-02-15T10:00:00'),
    endDate: new Date('2026-02-15T16:00:00'),
    timezone: 'Europe/Amsterdam',
    registrationDeadline: new Date('2026-02-13T23:59:59'),
    capacity: 50,
    registeredCount: 35,
    waitlistCount: 0,
    ticketTypes: [
      {
        id: 't1',
        name: 'General Admission',
        price: 0,
        currency: 'EUR',
        quantity: 40,
        sold: 30,
        minTier: 'free',
      },
      {
        id: 't2',
        name: 'VIP (includes lunch)',
        price: 1500,
        currency: 'EUR',
        quantity: 10,
        sold: 5,
        minTier: 'supporter',
      },
    ],
    tags: ['workshop', 'water', 'education', 'amsterdam'],
    hosts: [
      { id: 'h1', name: 'Dr. Maria van Berg', title: 'Water Research Lead', avatar: '/images/hosts/maria.jpg' },
    ],
    isFeatured: true,
    isPublic: true,
    minTier: 'free',
    impactCategory: 'clean_water',
    createdAt: new Date() as any,
    updatedAt: new Date() as any,
  },
  {
    id: '2',
    title: 'TRIBE Member Exclusive Meetup',
    slug: 'tribe-meetup-february',
    description: 'Monthly gathering for TRIBE members to connect, share experiences, and vote on upcoming impact projects.',
    shortDescription: 'Monthly TRIBE member networking event',
    type: 'meetup',
    format: 'hybrid',
    status: 'published',
    coverImage: '/images/events/meetup-cover.jpg',
    thumbnailImage: '/images/events/meetup-thumb.jpg',
    location: {
      type: 'hybrid',
      name: 'The Green Room',
      address: 'Westerstraat 15',
      city: 'Rotterdam',
      country: 'Netherlands',
      postalCode: '3014 XL',
    },
    virtualUrl: 'https://meet.gratis.ngo/tribe-feb',
    startDate: new Date('2026-02-22T18:00:00'),
    endDate: new Date('2026-02-22T21:00:00'),
    timezone: 'Europe/Amsterdam',
    registrationDeadline: new Date('2026-02-20T23:59:59'),
    capacity: 100,
    registeredCount: 78,
    waitlistCount: 5,
    ticketTypes: [
      {
        id: 't1',
        name: 'In-Person',
        price: 0,
        currency: 'EUR',
        quantity: 50,
        sold: 45,
        minTier: 'supporter',
      },
      {
        id: 't2',
        name: 'Online',
        price: 0,
        currency: 'EUR',
        quantity: 50,
        sold: 33,
        minTier: 'supporter',
      },
    ],
    tags: ['tribe', 'networking', 'community', 'hybrid'],
    hosts: [
      { id: 'h2', name: 'Jan de Vries', title: 'Community Manager', avatar: '/images/hosts/jan.jpg' },
    ],
    isFeatured: true,
    isPublic: false,
    minTier: 'supporter',
    createdAt: new Date() as any,
    updatedAt: new Date() as any,
  },
  {
    id: '3',
    title: 'Annual Impact Report Launch',
    slug: 'impact-report-2025-launch',
    description: 'Join us for the launch of our 2025 Annual Impact Report. We will share stories, data, and celebrate our community achievements.',
    shortDescription: 'Celebrating our 2025 achievements together',
    type: 'conference',
    format: 'online',
    status: 'published',
    coverImage: '/images/events/report-cover.jpg',
    thumbnailImage: '/images/events/report-thumb.jpg',
    location: {
      type: 'virtual',
    },
    virtualUrl: 'https://meet.gratis.ngo/impact-2025',
    startDate: new Date('2026-03-01T14:00:00'),
    endDate: new Date('2026-03-01T16:00:00'),
    timezone: 'Europe/Amsterdam',
    registrationDeadline: new Date('2026-03-01T12:00:00'),
    capacity: 500,
    registeredCount: 234,
    waitlistCount: 0,
    ticketTypes: [
      {
        id: 't1',
        name: 'Free Access',
        price: 0,
        currency: 'EUR',
        quantity: 500,
        sold: 234,
        minTier: 'free',
      },
    ],
    tags: ['report', 'impact', 'celebration', 'online'],
    hosts: [
      { id: 'h3', name: 'Emma Jansen', title: 'CEO', avatar: '/images/hosts/emma.jpg' },
      { id: 'h4', name: 'Thomas Bakker', title: 'Impact Director', avatar: '/images/hosts/thomas.jpg' },
    ],
    isFeatured: true,
    isPublic: true,
    minTier: 'free',
    createdAt: new Date() as any,
    updatedAt: new Date() as any,
  },
];

const eventTypeOptions = [
  { value: 'all', label: 'All Types' },
  { value: 'workshop', label: 'Workshops' },
  { value: 'meetup', label: 'Meetups' },
  { value: 'conference', label: 'Conferences' },
  { value: 'webinar', label: 'Webinars' },
  { value: 'volunteer', label: 'Volunteer' },
];

const formatOptions = [
  { value: 'all', label: 'All Formats' },
  { value: 'in_person', label: 'In-Person' },
  { value: 'online', label: 'Online' },
  { value: 'hybrid', label: 'Hybrid' },
];

export function EventsListing() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedFormat, setSelectedFormat] = useState('all');
  const [timeFilter, setTimeFilter] = useState<'upcoming' | 'past' | 'all'>('upcoming');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [viewMode, setViewMode] = useState<'grid' | 'calendar'>('grid');

  // Filter events
  const filteredEvents = useMemo(() => {
    let events = [...mockEvents];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      events = events.filter(
        (e) =>
          e.title.toLowerCase().includes(query) ||
          e.description.toLowerCase().includes(query) ||
          e.location?.city?.toLowerCase().includes(query) ||
          e.tags.some((t) => t.toLowerCase().includes(query))
      );
    }

    // Type filter
    if (selectedType !== 'all') {
      events = events.filter((e) => e.type === selectedType);
    }

    // Format filter
    if (selectedFormat !== 'all') {
      events = events.filter((e) => e.format === selectedFormat);
    }

    // Time filter
    if (timeFilter === 'upcoming') {
      events = events.filter((e) => isFuture(e.startDate));
    } else if (timeFilter === 'past') {
      events = events.filter((e) => isPast(e.endDate));
    }

    // Date filter
    if (selectedDate) {
      events = events.filter((e) => 
        format(e.startDate, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
      );
    }

    // Sort by date
    events.sort((a, b) => a.startDate.getTime() - b.startDate.getTime());

    return events;
  }, [searchQuery, selectedType, selectedFormat, timeFilter, selectedDate]);

  // Group events by time period
  const groupedEvents = useMemo(() => {
    const groups: { label: string; events: Event[] }[] = [];
    
    const today = filteredEvents.filter((e) => isToday(e.startDate));
    const tomorrow = filteredEvents.filter((e) => isTomorrow(e.startDate));
    const thisWeek = filteredEvents.filter(
      (e) => isThisWeek(e.startDate) && !isToday(e.startDate) && !isTomorrow(e.startDate)
    );
    const thisMonth = filteredEvents.filter(
      (e) => isThisMonth(e.startDate) && !isThisWeek(e.startDate)
    );
    const later = filteredEvents.filter((e) => !isThisMonth(e.startDate) && isFuture(e.startDate));

    if (today.length) groups.push({ label: 'Today', events: today });
    if (tomorrow.length) groups.push({ label: 'Tomorrow', events: tomorrow });
    if (thisWeek.length) groups.push({ label: 'This Week', events: thisWeek });
    if (thisMonth.length) groups.push({ label: 'This Month', events: thisMonth });
    if (later.length) groups.push({ label: 'Upcoming', events: later });

    return groups;
  }, [filteredEvents]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-bold">Events</h1>
          <p className="text-muted-foreground">
            Join workshops, meetups, and make connections
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <Icons.grid className="mr-2 h-4 w-4" />
            Grid
          </Button>
          <Button
            variant={viewMode === 'calendar' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('calendar')}
          >
            <Icons.calendar className="mr-2 h-4 w-4" />
            Calendar
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Icons.search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Time Filter */}
            <Tabs value={timeFilter} onValueChange={(v) => setTimeFilter(v as any)}>
              <TabsList>
                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                <TabsTrigger value="past">Past</TabsTrigger>
                <TabsTrigger value="all">All</TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Type Filter */}
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {eventTypeOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Format Filter */}
            <Select value={selectedFormat} onValueChange={setSelectedFormat}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {formatOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Date Picker */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className={cn(!selectedDate && 'text-muted-foreground')}>
                  <Icons.calendar className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, 'MMM d, yyyy') : 'Pick a date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  initialFocus
                />
                {selectedDate && (
                  <div className="p-2 border-t">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full"
                      onClick={() => setSelectedDate(undefined)}
                    >
                      Clear date
                    </Button>
                  </div>
                )}
              </PopoverContent>
            </Popover>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="text-sm text-muted-foreground">
        Showing {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''}
      </div>

      {/* Events Grid */}
      {viewMode === 'grid' && (
        <div className="space-y-8">
          {groupedEvents.map((group) => (
            <div key={group.label}>
              <h2 className="text-lg font-semibold mb-4">{group.label}</h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <AnimatePresence>
                  {group.events.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </AnimatePresence>
              </div>
            </div>
          ))}

          {filteredEvents.length === 0 && (
            <div className="text-center py-12">
              <Icons.calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold">No events found</h3>
              <p className="text-muted-foreground">
                Try adjusting your filters or check back later
              </p>
            </div>
          )}
        </div>
      )}

      {/* Calendar View */}
      {viewMode === 'calendar' && (
        <Card>
          <CardContent className="p-6">
            <EventCalendarView events={filteredEvents} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Event Card Component
function EventCard({ event }: { event: Event }) {
  const spotsLeft = event.capacity - event.registeredCount;
  const spotsPercentage = (event.registeredCount / event.capacity) * 100;
  const isAlmostFull = spotsPercentage >= 80;
  const isFull = spotsLeft <= 0;

  const formatBadge = {
    in_person: { label: 'In-Person', icon: Icons.mapPin, color: 'bg-blue-100 text-blue-700' },
    online: { label: 'Online', icon: Icons.video, color: 'bg-green-100 text-green-700' },
    hybrid: { label: 'Hybrid', icon: Icons.monitor, color: 'bg-purple-100 text-purple-700' },
  };

  const fb = formatBadge[event.format];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <Link href={`/events/${event.slug}`}>
        <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 h-full flex flex-col">
          {/* Cover Image */}
          <div className="relative aspect-video overflow-hidden">
            <Image
              src={event.coverImage}
              alt={event.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            
            {/* Date Badge */}
            <div className="absolute top-3 left-3 bg-white rounded-lg p-2 text-center shadow-lg">
              <p className="text-xs font-semibold text-gratis-blue-600 uppercase">
                {format(event.startDate, 'MMM')}
              </p>
              <p className="text-xl font-bold leading-none">
                {format(event.startDate, 'd')}
              </p>
            </div>

            {/* Format Badge */}
            <Badge className={cn('absolute top-3 right-3', fb.color)}>
              <fb.icon className="mr-1 h-3 w-3" />
              {fb.label}
            </Badge>

            {/* Featured Badge */}
            {event.isFeatured && (
              <Badge className="absolute bottom-3 left-3 bg-yellow-500">
                <Icons.star className="mr-1 h-3 w-3" />
                Featured
              </Badge>
            )}
          </div>

          {/* Content */}
          <CardContent className="p-4 flex-1 flex flex-col">
            {/* Type Tag */}
            <Badge variant="outline" className="w-fit mb-2 capitalize">
              {event.type}
            </Badge>

            <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-gratis-blue-600 transition-colors">
              {event.title}
            </h3>
            
            <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
              {event.shortDescription}
            </p>

            {/* Event Details */}
            <div className="mt-4 space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Icons.clock className="h-4 w-4" />
                <span>
                  {format(event.startDate, 'h:mm a')} - {format(event.endDate, 'h:mm a')}
                </span>
              </div>
              
              {event.location?.city && (
                <div className="flex items-center gap-2">
                  <Icons.mapPin className="h-4 w-4" />
                  <span>{event.location.city}, {event.location.country}</span>
                </div>
              )}
            </div>

            {/* Hosts */}
            {event.hosts && event.hosts.length > 0 && (
              <div className="mt-4 flex items-center gap-2">
                <div className="flex -space-x-2">
                  {event.hosts.slice(0, 3).map((host) => (
                    <Avatar key={host.id} className="h-6 w-6 border-2 border-background">
                      <AvatarImage src={host.avatar} />
                      <AvatarFallback>{host.name[0]}</AvatarFallback>
                    </Avatar>
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {event.hosts.map((h) => h.name).join(', ')}
                </span>
              </div>
            )}

            {/* Capacity */}
            <div className="mt-auto pt-4">
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-muted-foreground">
                  {event.registeredCount} registered
                </span>
                {isFull ? (
                  <Badge variant="destructive">Full</Badge>
                ) : isAlmostFull ? (
                  <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                    {spotsLeft} spots left
                  </Badge>
                ) : (
                  <span className="text-muted-foreground">
                    {spotsLeft} spots left
                  </span>
                )}
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={cn(
                    'h-full rounded-full transition-all',
                    isFull ? 'bg-red-500' : isAlmostFull ? 'bg-orange-500' : 'bg-gratis-green-500'
                  )}
                  style={{ width: `${Math.min(spotsPercentage, 100)}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}

// Calendar View Component
function EventCalendarView({ events }: { events: Event[] }) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  // Get events for selected date
  const selectedDateEvents = useMemo(() => {
    if (!selectedDate) return [];
    return events.filter(
      (e) => format(e.startDate, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
    );
  }, [events, selectedDate]);

  // Get dates that have events
  const eventDates = useMemo(() => {
    return events.map((e) => format(e.startDate, 'yyyy-MM-dd'));
  }, [events]);

  return (
    <div className="grid lg:grid-cols-[300px_1fr] gap-8">
      {/* Calendar */}
      <div>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          className="rounded-md border"
          modifiers={{
            hasEvent: (date) => eventDates.includes(format(date, 'yyyy-MM-dd')),
          }}
          modifiersStyles={{
            hasEvent: {
              backgroundColor: 'rgb(59, 130, 246)',
              color: 'white',
              fontWeight: 'bold',
            },
          }}
        />
      </div>

      {/* Selected Date Events */}
      <div>
        <h3 className="text-lg font-semibold mb-4">
          {selectedDate ? format(selectedDate, 'EEEE, MMMM d, yyyy') : 'Select a date'}
        </h3>

        {selectedDateEvents.length > 0 ? (
          <div className="space-y-4">
            {selectedDateEvents.map((event) => (
              <Link key={event.id} href={`/events/${event.slug}`}>
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-16 text-center">
                        <p className="text-sm text-muted-foreground">
                          {format(event.startDate, 'h:mm')}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {format(event.startDate, 'a')}
                        </p>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold">{event.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {event.shortDescription}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          {event.location?.city && (
                            <span className="flex items-center gap-1">
                              <Icons.mapPin className="h-3 w-3" />
                              {event.location.city}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Icons.users className="h-3 w-3" />
                            {event.registeredCount} going
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <Icons.calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No events on this date</p>
          </div>
        )}
      </div>
    </div>
  );
}

### FILE: src/app/(dashboard)/events/[slug]/page.tsx
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { EventDetail } from '@/components/events/EventDetail';

interface EventPageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: EventPageProps): Promise<Metadata> {
  // Fetch event data for metadata
  return {
    title: `Event | GRATIS.NGO`,
    description: 'Join this community event',
  };
}

export default function EventPage({ params }: EventPageProps) {
  return <EventDetail slug={params.slug} />;
}

### FILE: src/components/events/EventDetail.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Icons } from '@/components/shared/Icons';
import { cn, formatCurrency } from '@/lib/utils';
import { useAuth } from '@/lib/auth/AuthContext';

interface EventDetailProps {
  slug: string;
}

export function EventDetail({ slug }: EventDetailProps) {
  const { user } = useAuth();
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);

  // Mock event data - in production, fetch by slug
  const event = {
    id: '1',
    title: 'Clean Water Workshop',
    slug: 'clean-water-workshop-amsterdam',
    description: `
      Join us for an immersive workshop where you'll learn about water purification techniques 
      and discover how GRATIS.NGO projects are making a tangible difference in communities worldwide.

      ## What You'll Learn
      - Understanding water contamination and its global impact
      - Modern purification techniques and technologies
      - How GRATIS.NGO selects and funds water projects
      - Ways to maximize your personal impact

      ## Who Should Attend
      This workshop is perfect for anyone interested in clean water access, sustainability, 
      and making a real difference in the world.

      ## What's Included
      - Full-day workshop with expert speakers
      - Hands-on demonstrations
      - Networking with like-minded individuals
      - Certificate of participation
      - Refreshments and snacks
    `,
    shortDescription: 'Hands-on workshop about water purification',
    type: 'workshop',
    format: 'in_person',
    coverImage: '/images/events/workshop-cover.jpg',
    location: {
      type: 'physical',
      name: 'GRATIS.NGO HQ',
      address: 'Herengracht 420',
      city: 'Amsterdam',
      country: 'Netherlands',
      postalCode: '1017 BZ',
      coordinates: { lat: 52.3676, lng: 4.9041 },
    },
    startDate: new Date('2026-02-15T10:00:00'),
    endDate: new Date('2026-02-15T16:00:00'),
    timezone: 'Europe/Amsterdam',
    registrationDeadline: new Date('2026-02-13T23:59:59'),
    capacity: 50,
    registeredCount: 35,
    waitlistCount: 0,
    ticketTypes: [
      {
        id: 't1',
        name: 'General Admission',
        description: 'Access to all workshop sessions',
        price: 0,
        currency: 'EUR',
        quantity: 40,
        sold: 30,
        minTier: 'free',
        available: 10,
      },
      {
        id: 't2',
        name: 'VIP Experience',
        description: 'Includes lunch, exclusive Q&A, and goodie bag',
        price: 1500, // in cents
        currency: 'EUR',
        quantity: 10,
        sold: 5,
        minTier: 'supporter',
        available: 5,
      },
    ],
    schedule: [
      { time: '10:00', title: 'Registration & Welcome Coffee', duration: '30 min' },
      { time: '10:30', title: 'Opening Keynote: The Global Water Crisis', duration: '45 min' },
      { time: '11:15', title: 'Break', duration: '15 min' },
      { time: '11:30', title: 'Workshop Session 1: Purification Techniques', duration: '60 min' },
      { time: '12:30', title: 'Lunch Break', duration: '60 min' },
      { time: '13:30', title: 'Workshop Session 2: Hands-on Demonstration', duration: '90 min' },
      { time: '15:00', title: 'Panel Discussion: Making Impact', duration: '45 min' },
      { time: '15:45', title: 'Closing & Networking', duration: '15 min' },
    ],
    hosts: [
      {
        id: 'h1',
        name: 'Dr. Maria van Berg',
        title: 'Water Research Lead',
        bio: '15+ years in water research and sustainability',
        avatar: '/images/hosts/maria.jpg',
      },
      {
        id: 'h2',
        name: 'Jan de Vries',
        title: 'Community Manager',
        bio: 'Connecting people with purpose',
        avatar: '/images/hosts/jan.jpg',
      },
    ],
    faqs: [
      {
        question: 'Is parking available?',
        answer: 'Yes, there is paid parking available nearby at Q-Park Waterlooplein.',
      },
      {
        question: 'Can I get a refund if I can\'t attend?',
        answer: 'Yes, full refunds are available up to 48 hours before the event.',
      },
      {
        question: 'Is the venue wheelchair accessible?',
        answer: 'Yes, our venue is fully wheelchair accessible.',
      },
    ],
    tags: ['workshop', 'water', 'education', 'amsterdam'],
    minTier: 'free',
  };

  const spotsLeft = event.capacity - event.registeredCount;
  const isFull = spotsLeft <= 0;
  const canRegister = !isFull && new Date() < event.registrationDeadline;

  const handleRegister = async () => {
    if (!selectedTicket) return;
    setIsRegistering(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsRegistering(false);
    // Redirect to confirmation or show success
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Back Link */}
      <Link
        href="/events"
        className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6"
      >
        <Icons.arrowLeft className="mr-2 h-4 w-4" />
        Back to Events
      </Link>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative aspect-video rounded-2xl overflow-hidden"
          >
            <Image
              src={event.coverImage}
              alt={event.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            
            {/* Event Info Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <Badge className="mb-3 capitalize">{event.type}</Badge>
              <h1 className="text-3xl font-bold mb-2">{event.title}</h1>
              <p className="text-white/90">{event.shortDescription}</p>
            </div>
          </motion.div>

          {/* Date & Location Bar */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gratis-blue-100 rounded-lg">
                    <Icons.calendar className="h-5 w-5 text-gratis-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">{format(event.startDate, 'EEEE, MMMM d, yyyy')}</p>
                    <p className="text-sm text-muted-foreground">
                      {format(event.startDate, 'h:mm a')} - {format(event.endDate, 'h:mm a')} ({event.timezone})
                    </p>
                  </div>
                </div>

                <Separator orientation="vertical" className="h-12 hidden sm:block" />

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gratis-green-100 rounded-lg">
                    <Icons.mapPin className="h-5 w-5 text-gratis-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">{event.location.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {event.location.address}, {event.location.city}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>About This Event</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none">
                {event.description.split('\n').map((paragraph, i) => {
                  if (paragraph.startsWith('## ')) {
                    return <h3 key={i} className="text-lg font-semibold mt-6 mb-3">{paragraph.replace('## ', '')}</h3>;
                  }
                  if (paragraph.startsWith('- ')) {
                    return <li key={i} className="ml-4">{paragraph.replace('- ', '')}</li>;
                  }
                  if (paragraph.trim()) {
                    return <p key={i} className="text-muted-foreground mb-4">{paragraph}</p>;
                  }
                  return null;
                })}
              </div>
            </CardContent>
          </Card>

          {/* Schedule */}
          <Card>
            <CardHeader>
              <CardTitle>Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {event.schedule.map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-16 text-sm text-muted-foreground font-medium">
                      {item.time}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{item.title}</p>
                      <p className="text-sm text-muted-foreground">{item.duration}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Hosts */}
          <Card>
            <CardHeader>
              <CardTitle>Hosts & Speakers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-4">
                {event.hosts.map((host) => (
                  <div key={host.id} className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={host.avatar} />
                      <AvatarFallback>{host.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-semibold">{host.name}</h4>
                      <p className="text-sm text-muted-foreground">{host.title}</p>
                      <p className="text-sm text-muted-foreground mt-1">{host.bio}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* FAQs */}
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible>
                {event.faqs.map((faq, i) => (
                  <AccordionItem key={i} value={`faq-${i}`}>
                    <AccordionTrigger>{faq.question}</AccordionTrigger>
                    <AccordionContent>{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Registration */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">
            {/* Registration Card */}
            <Card>
              <CardHeader>
                <CardTitle>Register</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Capacity */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">
                      {event.registeredCount} registered
                    </span>
                    <span className={cn(isFull ? 'text-red-500' : 'text-muted-foreground')}>
                      {isFull ? 'Full' : `${spotsLeft} spots left`}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={cn(
                        'h-full rounded-full',
                        isFull ? 'bg-red-500' : 'bg-gratis-green-500'
                      )}
                      style={{ width: `${(event.registeredCount / event.capacity) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Ticket Selection */}
                <div className="space-y-3">
                  <Label>Select Ticket</Label>
                  <RadioGroup value={selectedTicket || ''} onValueChange={setSelectedTicket}>
                    {event.ticketTypes.map((ticket) => {
                      const tierOrder = { free: 0, supporter: 1, champion: 2, legend: 3 };
                      const userTierLevel = tierOrder[user?.tribeMembership.tier as keyof typeof tierOrder] ?? 0;
                      const requiredTierLevel = tierOrder[ticket.minTier as keyof typeof tierOrder];
                      const canSelect = userTierLevel >= requiredTierLevel && ticket.available > 0;

                      return (
                        <Label
                          key={ticket.id}
                          className={cn(
                            'flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition-colors',
                            selectedTicket === ticket.id && 'border-gratis-blue-500 bg-gratis-blue-50',
                            !canSelect && 'opacity-50 cursor-not-allowed'
                          )}
                        >
                          <RadioGroupItem
                            value={ticket.id}
                            disabled={!canSelect}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="font-medium">{ticket.name}</span>
                              <span className="font-semibold">
                                {ticket.price === 0 ? 'Free' : formatCurrency(ticket.price, ticket.currency)}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {ticket.description}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              {ticket.minTier !== 'free' && (
                                <Badge variant="outline" className="text-xs capitalize">
                                  {ticket.minTier}+ only
                                </Badge>
                              )}
                              <span className="text-xs text-muted-foreground">
                                {ticket.available} available
                              </span>
                            </div>
                          </div>
                        </Label>
                      );
                    })}
                  </RadioGroup>
                </div>

                {/* Register Button */}
                {canRegister ? (
                  <Button
                    className="w-full"
                    size="lg"
                    disabled={!selectedTicket || isRegistering}
                    onClick={handleRegister}
                  >
                    {isRegistering ? (
                      <>
                        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                        Registering...
                      </>
                    ) : (
                      <>
                        <Icons.ticket className="mr-2 h-4 w-4" />
                        Register Now
                      </>
                    )}
                  </Button>
                ) : (
                  <Button className="w-full" size="lg" disabled>
                    {isFull ? 'Event Full' : 'Registration Closed'}
                  </Button>
                )}

                {/* Deadline Notice */}
                <p className="text-xs text-center text-muted-foreground">
                  Registration closes {format(event.registrationDeadline, 'MMM d, yyyy \'at\' h:mm a')}
                </p>
              </CardContent>
            </Card>

            {/* Share Card */}
            <Card>
              <CardContent className="p-4">
                <p className="text-sm font-medium mb-3">Share this event</p>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon">
                    <Icons.facebook className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Icons.twitter className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Icons.linkedin className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Icons.link className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Map Preview */}
            {event.location.coordinates && (
              <Card>
                <CardContent className="p-0">
                  <div className="aspect-video bg-gray-100 rounded-t-lg">
                    {/* Add map component here */}
                    <div className="h-full flex items-center justify-center text-muted-foreground">
                      <Icons.mapPin className="h-8 w-8" />
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="font-medium">{event.location.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {event.location.address}, {event.location.postalCode} {event.location.city}
                    </p>
                    <Button variant="link" className="p-0 h-auto mt-2" asChild>
                      <a
                        href={`https://maps.google.com/?q=${event.location.coordinates.lat},${event.location.coordinates.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Get Directions
                        <Icons.externalLink className="ml-1 h-3 w-3" />
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

# ═══════════════════════════════════════════════════════════════════════════════
# SECTION 10: VIDEO PLATFORM (MUX INTEGRATION)
# ═══════════════════════════════════════════════════════════════════════════════

## PROMPT 10.1: Create Video Player & Content System

```
Create the complete video platform with Mux integration, video player, and content library.

### FILE: src/lib/mux/config.ts
// =============================================================================
// MUX VIDEO CONFIGURATION
// =============================================================================

import Mux from '@mux/mux-node';

// Initialize Mux client (server-side only)
const muxClient = new Mux({
  tokenId: process.env.MUX_TOKEN_ID!,
  tokenSecret: process.env.MUX_TOKEN_SECRET!,
});

export const muxVideo = muxClient.video;
export const muxData = muxClient.data;

// Mux configuration
export const MUX_CONFIG = {
  // Playback settings
  playbackPolicy: 'signed' as const, // 'public' | 'signed'
  signingKeyId: process.env.MUX_SIGNING_KEY_ID,
  signingPrivateKey: process.env.MUX_SIGNING_PRIVATE_KEY,
  
  // Upload settings
  corsOrigin: process.env.NEXT_PUBLIC_APP_URL || '*',
  maxUploadDurationSeconds: 7200, // 2 hours max
  
  // Quality settings
  mp4Support: 'standard' as const,
  masterAccess: 'none' as const,
  
  // Test mode
  testMode: process.env.NODE_ENV !== 'production',
};

// Generate signed playback URL
export function getSignedPlaybackUrl(playbackId: string): string {
  if (MUX_CONFIG.playbackPolicy === 'public') {
    return `https://stream.mux.com/${playbackId}.m3u8`;
  }
  
  // For signed URLs, generate JWT token
  const token = generateMuxToken(playbackId);
  return `https://stream.mux.com/${playbackId}.m3u8?token=${token}`;
}

// Generate thumbnail URL
export function getThumbnailUrl(
  playbackId: string,
  options?: {
    width?: number;
    height?: number;
    time?: number;
    fitMode?: 'preserve' | 'stretch' | 'crop' | 'smartcrop' | 'pad';
  }
): string {
  const params = new URLSearchParams();
  
  if (options?.width) params.set('width', options.width.toString());
  if (options?.height) params.set('height', options.height.toString());
  if (options?.time) params.set('time', options.time.toString());
  if (options?.fitMode) params.set('fit_mode', options.fitMode);
  
  const queryString = params.toString();
  return `https://image.mux.com/${playbackId}/thumbnail.jpg${queryString ? `?${queryString}` : ''}`;
}

// Generate animated GIF URL
export function getAnimatedGifUrl(
  playbackId: string,
  options?: {
    width?: number;
    start?: number;
    end?: number;
    fps?: number;
  }
): string {
  const params = new URLSearchParams();
  
  if (options?.width) params.set('width', options.width.toString());
  if (options?.start) params.set('start', options.start.toString());
  if (options?.end) params.set('end', options.end.toString());
  if (options?.fps) params.set('fps', options.fps.toString());
  
  const queryString = params.toString();
  return `https://image.mux.com/${playbackId}/animated.gif${queryString ? `?${queryString}` : ''}`;
}

// Generate storyboard URL
export function getStoryboardUrl(playbackId: string): string {
  return `https://image.mux.com/${playbackId}/storyboard.vtt`;
}

// JWT token generation for signed playback
function generateMuxToken(playbackId: string): string {
  // Implementation depends on your JWT library
  // This is a simplified example
  const jwt = require('jsonwebtoken');
  
  const payload = {
    sub: playbackId,
    aud: 'v',
    exp: Math.floor(Date.now() / 1000) + 7200, // 2 hours
    kid: MUX_CONFIG.signingKeyId,
  };
  
  return jwt.sign(payload, MUX_CONFIG.signingPrivateKey, {
    algorithm: 'RS256',
  });
}

### FILE: src/lib/mux/api.ts
// =============================================================================
// MUX API FUNCTIONS
// =============================================================================

import { muxVideo } from './config';
import type { Timestamp } from 'firebase/firestore';

// Video asset type
export interface VideoAsset {
  id: string;
  muxAssetId: string;
  muxPlaybackId: string;
  title: string;
  description: string;
  duration: number;
  aspectRatio: string;
  status: 'preparing' | 'ready' | 'errored';
  thumbnailUrl: string;
  category: string;
  tags: string[];
  minTier: 'free' | 'supporter' | 'champion' | 'legend';
  views: number;
  likes: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Create direct upload URL
export async function createUploadUrl(): Promise<{
  uploadUrl: string;
  uploadId: string;
}> {
  const upload = await muxVideo.uploads.create({
    cors_origin: process.env.NEXT_PUBLIC_APP_URL,
    new_asset_settings: {
      playback_policy: ['signed'],
      mp4_support: 'standard',
      master_access: 'none',
    },
  });

  return {
    uploadUrl: upload.url,
    uploadId: upload.id,
  };
}

// Get asset details
export async function getAsset(assetId: string) {
  return await muxVideo.assets.retrieve(assetId);
}

// Delete asset
export async function deleteAsset(assetId: string) {
  return await muxVideo.assets.delete(assetId);
}

// Create live stream
export async function createLiveStream() {
  return await muxVideo.liveStreams.create({
    playback_policy: ['signed'],
    new_asset_settings: {
      playback_policy: ['signed'],
    },
    reduced_latency: true,
  });
}

// Get live stream
export async function getLiveStream(streamId: string) {
  return await muxVideo.liveStreams.retrieve(streamId);
}

### FILE: src/components/video/MuxPlayer.tsx
'use client';

import React, { useEffect, useRef, useState } from 'react';
import MuxPlayerReact from '@mux/mux-player-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Icons } from '@/components/shared/Icons';
import { cn, formatDuration } from '@/lib/utils';

interface MuxPlayerProps {
  playbackId: string;
  title?: string;
  poster?: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  startTime?: number;
  onTimeUpdate?: (currentTime: number) => void;
  onEnded?: () => void;
  onError?: (error: any) => void;
  className?: string;
  aspectRatio?: string;
  accentColor?: string;
}

export function MuxPlayer({
  playbackId,
  title,
  poster,
  autoPlay = false,
  muted = false,
  loop = false,
  startTime,
  onTimeUpdate,
  onEnded,
  onError,
  className,
  aspectRatio = '16:9',
  accentColor = '#3B82F6',
}: MuxPlayerProps) {
  const playerRef = useRef<any>(null);
  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(muted);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [volume, setVolume] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();

  // Handle controls visibility
  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
  };

  // Cleanup
  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, []);

  const handlePlayPause = () => {
    const player = playerRef.current;
    if (!player) return;

    if (isPlaying) {
      player.pause();
    } else {
      player.play();
    }
  };

  const handleSeek = (value: number[]) => {
    const player = playerRef.current;
    if (!player) return;
    player.currentTime = value[0];
  };

  const handleVolumeChange = (value: number[]) => {
    const player = playerRef.current;
    if (!player) return;
    const newVolume = value[0];
    player.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    const player = playerRef.current;
    if (!player) return;
    player.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const toggleFullscreen = () => {
    const container = playerRef.current?.parentElement;
    if (!container) return;

    if (!document.fullscreenElement) {
      container.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const skipForward = () => {
    const player = playerRef.current;
    if (!player) return;
    player.currentTime = Math.min(player.currentTime + 10, duration);
  };

  const skipBackward = () => {
    const player = playerRef.current;
    if (!player) return;
    player.currentTime = Math.max(player.currentTime - 10, 0);
  };

  if (error) {
    return (
      <div className={cn('bg-gray-900 flex items-center justify-center', className)}>
        <div className="text-center text-white p-8">
          <Icons.alertTriangle className="h-12 w-12 mx-auto mb-4 text-red-500" />
          <h3 className="text-lg font-semibold mb-2">Video Unavailable</h3>
          <p className="text-gray-400">{error}</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn('relative group bg-black rounded-lg overflow-hidden', className)}
      style={{ aspectRatio }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      {/* Mux Player */}
      <MuxPlayerReact
        ref={playerRef}
        playbackId={playbackId}
        metadata={{
          video_title: title,
          viewer_user_id: 'anonymous', // Replace with actual user ID
        }}
        streamType="on-demand"
        autoPlay={autoPlay}
        muted={muted}
        loop={loop}
        startTime={startTime}
        poster={poster}
        accentColor={accentColor}
        primaryColor="#ffffff"
        secondaryColor="rgba(0,0,0,0.7)"
        onLoadedMetadata={(e: any) => {
          setDuration(e.target.duration);
          setIsReady(true);
        }}
        onTimeUpdate={(e: any) => {
          setCurrentTime(e.target.currentTime);
          onTimeUpdate?.(e.target.currentTime);
        }}
        onProgress={(e: any) => {
          if (e.target.buffered.length > 0) {
            setBuffered(e.target.buffered.end(e.target.buffered.length - 1));
          }
        }}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => {
          setIsPlaying(false);
          onEnded?.();
        }}
        onError={(e: any) => {
          setError('Failed to load video');
          onError?.(e);
        }}
        style={{ 
          width: '100%', 
          height: '100%',
          '--controls': 'none', // Hide default controls
        } as any}
      />

      {/* Custom Controls Overlay */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30"
          >
            {/* Top Bar */}
            <div className="absolute top-0 left-0 right-0 p-4">
              <h2 className="text-white font-semibold truncate">{title}</h2>
            </div>

            {/* Center Play Button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <Button
                variant="ghost"
                size="lg"
                className="w-20 h-20 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm"
                onClick={handlePlayPause}
              >
                {isPlaying ? (
                  <Icons.pause className="h-10 w-10 text-white" />
                ) : (
                  <Icons.play className="h-10 w-10 text-white ml-1" />
                )}
              </Button>
            </div>

            {/* Bottom Controls */}
            <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
              {/* Progress Bar */}
              <div className="relative h-1 group/progress">
                {/* Buffered */}
                <div
                  className="absolute inset-y-0 left-0 bg-white/30 rounded-full"
                  style={{ width: `${(buffered / duration) * 100}%` }}
                />
                {/* Seek Slider */}
                <Slider
                  value={[currentTime]}
                  max={duration}
                  step={0.1}
                  onValueChange={handleSeek}
                  className="absolute inset-0"
                />
              </div>

              {/* Controls Row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {/* Play/Pause */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/20"
                    onClick={handlePlayPause}
                  >
                    {isPlaying ? (
                      <Icons.pause className="h-5 w-5" />
                    ) : (
                      <Icons.play className="h-5 w-5" />
                    )}
                  </Button>

                  {/* Skip Backward */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/20"
                    onClick={skipBackward}
                  >
                    <Icons.skipBack className="h-5 w-5" />
                  </Button>

                  {/* Skip Forward */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/20"
                    onClick={skipForward}
                  >
                    <Icons.skipForward className="h-5 w-5" />
                  </Button>

                  {/* Volume */}
                  <div className="flex items-center gap-2 group/volume">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white hover:bg-white/20"
                      onClick={toggleMute}
                    >
                      {isMuted || volume === 0 ? (
                        <Icons.volumeX className="h-5 w-5" />
                      ) : volume < 0.5 ? (
                        <Icons.volume1 className="h-5 w-5" />
                      ) : (
                        <Icons.volume2 className="h-5 w-5" />
                      )}
                    </Button>
                    <div className="w-0 overflow-hidden group-hover/volume:w-20 transition-all duration-200">
                      <Slider
                        value={[isMuted ? 0 : volume]}
                        max={1}
                        step={0.01}
                        onValueChange={handleVolumeChange}
                      />
                    </div>
                  </div>

                  {/* Time Display */}
                  <span className="text-white text-sm">
                    {formatDuration(currentTime)} / {formatDuration(duration)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Fullscreen */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/20"
                    onClick={toggleFullscreen}
                  >
                    {isFullscreen ? (
                      <Icons.minimize className="h-5 w-5" />
                    ) : (
                      <Icons.maximize className="h-5 w-5" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading Overlay */}
      {!isReady && (
        <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
          <Icons.spinner className="h-8 w-8 text-white animate-spin" />
        </div>
      )}
    </div>
  );
}

### FILE: src/app/(dashboard)/videos/page.tsx
import { Metadata } from 'next';
import { VideoLibrary } from '@/components/video/VideoLibrary';

export const metadata: Metadata = {
  title: 'Videos | GRATIS.NGO',
  description: 'Watch impact stories, tutorials, and community content',
};

export default function VideosPage() {
  return <VideoLibrary />;
}

### FILE: src/components/video/VideoLibrary.tsx
'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Icons } from '@/components/shared/Icons';
import { cn, formatDuration, formatNumber } from '@/lib/utils';
import { getThumbnailUrl } from '@/lib/mux/config';
import { useAuth } from '@/lib/auth/AuthContext';

// Mock video data
const mockVideos = [
  {
    id: '1',
    muxPlaybackId: 'abc123',
    title: 'How GRATIS.NGO Works: From Bottle to Impact',
    description: 'Learn about our unique model that delivers free bottles while funding clean water projects.',
    duration: 342, // 5:42
    category: 'how_it_works',
    tags: ['introduction', 'impact', 'how-to'],
    minTier: 'free',
    views: 15420,
    likes: 892,
    thumbnailTime: 15,
    featured: true,
    createdAt: new Date('2026-01-15'),
  },
  {
    id: '2',
    muxPlaybackId: 'def456',
    title: 'Impact Story: Clean Water in Kenya',
    description: 'Follow the journey of a community in Kenya gaining access to clean water.',
    duration: 485, // 8:05
    category: 'impact_stories',
    tags: ['kenya', 'water', 'community'],
    minTier: 'free',
    views: 12350,
    likes: 756,
    thumbnailTime: 30,
    featured: true,
    createdAt: new Date('2026-01-10'),
  },
  {
    id: '3',
    muxPlaybackId: 'ghi789',
    title: 'TRIBE Member Exclusive: Behind the Scenes',
    description: 'Exclusive look at how we select and fund impact projects.',
    duration: 612, // 10:12
    category: 'exclusive',
    tags: ['tribe', 'exclusive', 'behind-the-scenes'],
    minTier: 'supporter',
    views: 3420,
    likes: 289,
    thumbnailTime: 45,
    featured: false,
    createdAt: new Date('2026-01-05'),
  },
  {
    id: '4',
    muxPlaybackId: 'jkl012',
    title: 'Annual Impact Report 2025 Highlights',
    description: 'A summary of our achievements and impact throughout 2025.',
    duration: 256, // 4:16
    category: 'reports',
    tags: ['report', 'impact', '2025'],
    minTier: 'free',
    views: 8920,
    likes: 542,
    thumbnailTime: 20,
    featured: true,
    createdAt: new Date('2026-01-01'),
  },
];

const categories = [
  { value: 'all', label: 'All Videos' },
  { value: 'how_it_works', label: 'How It Works' },
  { value: 'impact_stories', label: 'Impact Stories' },
  { value: 'tutorials', label: 'Tutorials' },
  { value: 'reports', label: 'Reports' },
  { value: 'exclusive', label: 'Exclusive' },
];

const sortOptions = [
  { value: 'newest', label: 'Newest' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'duration', label: 'Duration' },
];

export function VideoLibrary() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // Filter and sort videos
  const filteredVideos = useMemo(() => {
    let videos = [...mockVideos];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      videos = videos.filter(
        (v) =>
          v.title.toLowerCase().includes(query) ||
          v.description.toLowerCase().includes(query) ||
          v.tags.some((t) => t.toLowerCase().includes(query))
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      videos = videos.filter((v) => v.category === selectedCategory);
    }

    // Sort
    switch (sortBy) {
      case 'newest':
        videos.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        break;
      case 'popular':
        videos.sort((a, b) => b.views - a.views);
        break;
      case 'duration':
        videos.sort((a, b) => a.duration - b.duration);
        break;
    }

    return videos;
  }, [searchQuery, selectedCategory, sortBy]);

  // Featured videos
  const featuredVideos = mockVideos.filter((v) => v.featured).slice(0, 3);

  // Check if user can watch video
  const canWatch = (video: typeof mockVideos[0]): boolean => {
    if (video.minTier === 'free') return true;
    if (!user) return false;
    const tierOrder = { free: 0, supporter: 1, champion: 2, legend: 3 };
    const userTierLevel = tierOrder[user.tribeMembership.tier as keyof typeof tierOrder];
    const requiredTierLevel = tierOrder[video.minTier as keyof typeof tierOrder];
    return userTierLevel >= requiredTierLevel;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Video Library</h1>
        <p className="text-muted-foreground">
          Watch impact stories, tutorials, and community content
        </p>
      </div>

      {/* Featured Videos */}
      {featuredVideos.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold mb-4">Featured</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {featuredVideos.map((video, index) => (
              <VideoCard
                key={video.id}
                video={video}
                canWatch={canWatch(video)}
                size={index === 0 ? 'large' : 'medium'}
              />
            ))}
          </div>
        </section>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Icons.search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search videos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Category */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
          <TabsList>
            {categories.slice(0, 5).map((cat) => (
              <TabsTrigger key={cat.value} value={cat.value}>
                {cat.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Sort */}
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Results */}
      <div className="text-sm text-muted-foreground">
        {filteredVideos.length} video{filteredVideos.length !== 1 ? 's' : ''}
      </div>

      {/* Video Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AnimatePresence>
          {filteredVideos.map((video) => (
            <VideoCard
              key={video.id}
              video={video}
              canWatch={canWatch(video)}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {filteredVideos.length === 0 && (
        <div className="text-center py-12">
          <Icons.video className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold">No videos found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search or filters
          </p>
        </div>
      )}
    </div>
  );
}

// Video Card Component
function VideoCard({
  video,
  canWatch,
  size = 'medium',
}: {
  video: typeof mockVideos[0];
  canWatch: boolean;
  size?: 'small' | 'medium' | 'large';
}) {
  const [isHovered, setIsHovered] = useState(false);

  const thumbnailUrl = getThumbnailUrl(video.muxPlaybackId, {
    width: size === 'large' ? 1280 : 640,
    time: video.thumbnailTime,
  });

  const tierBadgeColors: Record<string, string> = {
    free: 'bg-gray-100 text-gray-700',
    supporter: 'bg-blue-100 text-blue-700',
    champion: 'bg-purple-100 text-purple-700',
    legend: 'bg-amber-100 text-amber-700',
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={cn(size === 'large' && 'md:col-span-2 md:row-span-2')}
    >
      <Link href={canWatch ? `/videos/${video.id}` : '/tribe'}>
        <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300">
          {/* Thumbnail */}
          <div className="relative aspect-video overflow-hidden bg-gray-100">
            <Image
              src={thumbnailUrl}
              alt={video.title}
              fill
              className={cn(
                'object-cover transition-transform duration-300',
                isHovered && 'scale-105'
              )}
            />

            {/* Duration Badge */}
            <Badge className="absolute bottom-2 right-2 bg-black/80 text-white">
              {formatDuration(video.duration)}
            </Badge>

            {/* Tier Lock Overlay */}
            {!canWatch && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <div className="text-center text-white">
                  <Icons.lock className="h-8 w-8 mx-auto mb-2" />
                  <Badge className={tierBadgeColors[video.minTier]}>
                    {video.minTier}+ only
                  </Badge>
                </div>
              </div>
            )}

            {/* Play Overlay */}
            {canWatch && (
              <motion.div
                className="absolute inset-0 bg-black/40 flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: isHovered ? 1 : 0 }}
              >
                <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center">
                  <Icons.play className="h-8 w-8 text-gratis-blue-600 ml-1" />
                </div>
              </motion.div>
            )}
          </div>

          {/* Content */}
          <CardContent className="p-4">
            <h3 className={cn(
              'font-semibold line-clamp-2 group-hover:text-gratis-blue-600 transition-colors',
              size === 'large' ? 'text-lg' : 'text-base'
            )}>
              {video.title}
            </h3>
            
            {size !== 'small' && (
              <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
                {video.description}
              </p>
            )}

            {/* Stats */}
            <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Icons.eye className="h-4 w-4" />
                {formatNumber(video.views)}
              </span>
              <span className="flex items-center gap-1">
                <Icons.heart className="h-4 w-4" />
                {formatNumber(video.likes)}
              </span>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
```

---

This completes Part 2 with Sections 6-10. The document includes:
- **Section 6**: Homepage & Marketing Pages (Hero, How It Works, Impact Stats, Testimonials)
- **Section 7**: User Dashboard (Layout, Overview, Stats Widgets)
- **Section 8**: Bottle System (Gallery, Selection, Filtering)
- **Section 9**: Events System (Listing, Calendar, Registration, Detail Pages)
- **Section 10**: Video Platform (Mux Integration, Custom Player, Video Library)

Part 3 will cover Sections 11-15: Social Features, TRIBE System, Donations, Impact Projects, and Referrals. Shall I continue?
