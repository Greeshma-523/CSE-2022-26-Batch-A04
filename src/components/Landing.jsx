import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CloudArrowUpIcon, 
  LockClosedIcon, 
  ShieldCheckIcon,
  ServerIcon,
  ArrowRightIcon,
  CheckBadgeIcon,
  UserGroupIcon,
  DocumentIcon,
  KeyIcon,
  CpuChipIcon,
  GlobeAltIcon,
  ChartBarIcon,
  AcademicCapIcon,
  BuildingOfficeIcon,
  StarIcon
} from '@heroicons/react/24/outline';

const Landing = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState({});
  const sectionRefs = useRef([]);

  useEffect(() => {
    const observers = sectionRefs.current.map((ref, index) => {
      if (!ref) return null;
      
      const observer = new IntersectionObserver(
        ([entry]) => {
          setIsVisible(prev => ({ ...prev, [index]: entry.isIntersecting }));
        },
        { threshold: 0.1, rootMargin: '0px' }
      );
      
      observer.observe(ref);
      return observer;
    });

    return () => {
      observers.forEach(observer => observer?.disconnect());
    };
  }, []);

  const features = [
    {
      icon: <LockClosedIcon className="w-8 h-8" />,
      title: 'Homomorphic Encryption',
      description: 'Perform computations on encrypted data without ever decrypting it, ensuring complete privacy throughout the process.',
      gradient: 'from-blue-500 to-cyan-500',
      stats: 'AES-256 + Homomorphic'
    },
    {
      icon: <ShieldCheckIcon className="w-8 h-8" />,
      title: 'Verifiable Results',
      description: 'Cryptographically verify computation correctness through zero-knowledge proofs without revealing sensitive data.',
      gradient: 'from-purple-500 to-pink-500',
      stats: 'ZK-SNARKs Verified'
    },
    {
      icon: <ServerIcon className="w-8 h-8" />,
      title: 'Secret Sharing',
      description: 'Distribute trust across multiple cloud providers using Shamir\'s secret sharing for enhanced security.',
      gradient: 'from-green-500 to-emerald-500',
      stats: '5/3 Threshold Scheme'
    },
    {
      icon: <CloudArrowUpIcon className="w-8 h-8" />,
      title: 'Cloud Integration',
      description: 'Seamless integration with AWS, Azure, and Google Cloud platforms with automatic load balancing.',
      gradient: 'from-orange-500 to-red-500',
      stats: 'Multi-Cloud Ready'
    },
    {
      icon: <CpuChipIcon className="w-8 h-8" />,
      title: 'High Performance',
      description: 'Optimized cryptographic operations with hardware acceleration and parallel processing capabilities.',
      gradient: 'from-indigo-500 to-purple-500',
      stats: '< 100ms Latency'
    },
    {
      icon: <GlobeAltIcon className="w-8 h-8" />,
      title: 'Global Compliance',
      description: 'GDPR, HIPAA, and SOC2 compliant with automated audit trails and regulatory reporting.',
      gradient: 'from-yellow-500 to-orange-500',
      stats: '100% Compliant'
    }
  ];

  const steps = [
    {
      number: '01',
      title: 'Register & Verify',
      description: 'Create your account and complete KYC verification for enhanced security.',
      icon: <AcademicCapIcon className="w-12 h-12" />,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      number: '02',
      title: 'Upload & Encrypt',
      description: 'Files are automatically encrypted using homomorphic encryption and split into shares.',
      icon: <DocumentIcon className="w-12 h-12" />,
      color: 'from-purple-500 to-pink-500'
    },
    {
      number: '03',
      title: 'Process & Verify',
      description: 'Cloud providers process encrypted data while you verify each computation step.',
      icon: <CpuChipIcon className="w-12 h-12" />,
      color: 'from-green-500 to-emerald-500'
    },
    {
      number: '04',
      title: 'Decrypt & Access',
      description: 'Securely decrypt and access your data with complete audit trails.',
      icon: <KeyIcon className="w-12 h-12" />,
      color: 'from-orange-500 to-red-500'
    }
  ];

  const testimonials = [
    {
      name: 'Dr. Sarah Chen',
      role: 'CTO, TechCorp',
      content: 'EVHSS revolutionized how we handle sensitive data in the cloud. The homomorphic encryption capabilities are game-changing.',
      rating: 5,
      image: 'SC'
    },
    {
      name: 'Michael Rodriguez',
      role: 'Security Lead, FinanceHub',
      content: 'The verifiable computing feature gives us unprecedented control and trust in cloud computations.',
      rating: 5,
      image: 'MR'
    },
    {
      name: 'Prof. James Wilson',
      role: 'Research Director',
      content: 'Perfect for research institutions needing to collaborate on sensitive data while maintaining privacy.',
      rating: 5,
      image: 'JW'
    }
  ];

  const stats = [
    { value: '10M+', label: 'Files Secured', icon: <DocumentIcon className="w-6 h-6" /> },
    { value: '99.99%', label: 'Uptime SLA', icon: <ChartBarIcon className="w-6 h-6" /> },
    { value: '500+', label: 'Enterprise Clients', icon: <BuildingOfficeIcon className="w-6 h-6" /> },
    { value: '24/7', label: 'Premium Support', icon: <UserGroupIcon className="w-6 h-6" /> }
  ];

  return (
    <div className="min-h-screen bg-[#0B1120] text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-50 bg-[#0B1120]/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-2xl font-bold text-white">E</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                VHSS
              </span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a>
              <a href="#how-it-works" className="text-gray-300 hover:text-white transition-colors">How it Works</a>
              <a href="#testimonials" className="text-gray-300 hover:text-white transition-colors">Testimonials</a>
              <a href="#pricing" className="text-gray-300 hover:text-white transition-colors">Pricing</a>
            </div>

            <div className="flex items-center space-x-4">
              <button 
                onClick={() => navigate('/user/login')}
                className="text-gray-300 hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition-all hover:bg-white/5"
              >
                Sign In
              </button>
              <button 
                onClick={() => navigate('/user/register')}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105"
              >
                Get Started Free
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div 
              ref={el => sectionRefs.current[0] = el}
              className={`space-y-8 transition-all duration-1000 transform ${
                isVisible[0] ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'
              }`}
            >
              <div className="inline-flex items-center bg-white/5 backdrop-blur-sm border border-white/10 px-4 py-2 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
                <span className="text-sm text-gray-300">Now Supporting Homomorphic Encryption v2.0</span>
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                Secure Cloud
                <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Computing
                </span>
                <span className="block text-white">with Privacy</span>
              </h1>
              
              <p className="text-xl text-gray-400 leading-relaxed max-w-lg">
                Experience the future of cloud security with homomorphic encryption. 
                Process encrypted data without ever exposing your sensitive information.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={() => navigate('/user/register')}
                  className="group relative bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/25"
                >
                  <span className="relative z-10 flex items-center">
                    Start Free Trial
                    <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </button>
                
                <button 
                  onClick={() => navigate('/cloud/login')}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition-all duration-300 hover:scale-105"
                >
                  Cloud Provider →
                </button>
              </div>

              <div className="flex items-center space-x-8 pt-8">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 border-2 border-[#0B1120] flex items-center justify-center text-sm font-bold">
                      {i === 4 ? '+99' : `U${i}`}
                    </div>
                  ))}
                </div>
                <div className="text-sm">
                  <div className="font-semibold">Trusted by 500+ companies</div>
                  <div className="text-gray-400">Enterprise-grade security</div>
                </div>
              </div>
            </div>

            <div 
              ref={el => sectionRefs.current[1] = el}
              className={`relative transition-all duration-1000 delay-300 transform ${
                isVisible[1] ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl blur-3xl opacity-20 animate-pulse"></div>
              
              <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Encryption', value: 'AES-256', color: 'from-blue-500 to-cyan-500' },
                    { label: 'Protocol', value: 'Homomorphic', color: 'from-purple-500 to-pink-500' },
                    { label: 'Verification', value: 'ZK-SNARKs', color: 'from-green-500 to-emerald-500' },
                    { label: 'Shares', value: '5/3 Scheme', color: 'from-orange-500 to-red-500' }
                  ].map((item, i) => (
                    <div key={i} className="bg-white/5 rounded-xl p-4 border border-white/5">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${item.color} mb-3 flex items-center justify-center`}>
                        <ShieldCheckIcon className="w-5 h-5" />
                      </div>
                      <div className="text-sm text-gray-400">{item.label}</div>
                      <div className="text-lg font-semibold">{item.value}</div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">Active Encryptions</span>
                    <span className="text-sm text-green-400">+12% this week</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div className="w-3/4 h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
                  </div>
                </div>

                <div className="absolute -bottom-4 -right-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-xl text-sm font-semibold shadow-xl animate-bounce">
                  ⚡ 99.99% Uptime SLA
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 border-y border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div 
                key={index}
                ref={el => sectionRefs.current[index + 2] = el}
                className={`text-center transition-all duration-1000 delay-${index * 200} transform ${
                  isVisible[index + 2] ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-4 mx-auto">
                  {stat.icon}
                </div>
                <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-gray-400 mt-2">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold mb-6">
              Enterprise-Grade{' '}
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Security Features
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Our platform combines cutting-edge cryptographic protocols with user-friendly interfaces
              to provide the most secure cloud computing experience available.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                ref={el => sectionRefs.current[index + 6] = el}
                className={`group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/10 ${
                  isVisible[index + 6] ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity`}></div>
                
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${feature.gradient} p-4 mb-6 group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                
                <h3 className="text-2xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-400 mb-6 leading-relaxed">{feature.description}</p>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">{feature.stats}</span>
                  <ArrowRightIcon className="w-5 h-5 text-gray-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="relative z-10 py-32 px-4 sm:px-6 lg:px-8 bg-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold mb-6">
              Simple{' '}
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                4-Step Process
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Get started in minutes with our streamlined workflow
            </p>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div
                key={index}
                ref={el => sectionRefs.current[index + 12] = el}
                className={`relative ${
                  isVisible[index + 12] ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                {index < steps.length - 1 && (
                  <div className="absolute top-24 left-1/2 w-full h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 hidden lg:block"></div>
                )}
                
                <div className="relative z-10 text-center">
                  <div className={`w-24 h-24 mx-auto rounded-3xl bg-gradient-to-r ${step.color} p-6 mb-6 shadow-xl shadow-${step.color.split(' ')[1]}/20`}>
                    {step.icon}
                  </div>
                  
                  <div className="absolute -top-4 -right-4 w-12 h-12 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center font-bold text-xl border border-white/20">
                    {step.number}
                  </div>
                  
                  <h3 className="text-2xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-gray-400">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="relative z-10 py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold mb-6">
              Trusted by{' '}
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Industry Leaders
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              See what our clients say about our platform
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                ref={el => sectionRefs.current[index + 16] = el}
                className={`bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-500 hover:scale-105 ${
                  isVisible[index + 16] ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className="flex items-center space-x-1 mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <StarIcon key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                  ))}
                </div>
                
                <p className="text-gray-300 mb-6 leading-relaxed">"{testimonial.content}"</p>
                
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center font-bold">
                    {testimonial.image}
                  </div>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl blur-3xl opacity-30"></div>
          
          <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-12 text-center">
            <h2 className="text-4xl font-bold mb-6">
              Ready to Secure Your{' '}
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Cloud Data?
              </span>
            </h2>
            
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Join thousands of organizations that trust EVHSS for their cloud computing needs. 
              Start with a 14-day free trial, no credit card required.
            </p>
            
            <div className="flex flex-wrap gap-4 justify-center">
              <button 
                onClick={() => navigate('/user/register')}
                className="group bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105"
              >
                Start Free Trial
                <ArrowRightIcon className="w-5 h-5 ml-2 inline-block group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button 
                onClick={() => navigate('/cloud/login')}
                className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/20 transition-all duration-300"
              >
                Contact Sales
              </button>
            </div>

            <div className="flex items-center justify-center space-x-8 mt-8 text-sm text-gray-400">
              <div className="flex items-center">
                <CheckBadgeIcon className="w-5 h-5 text-green-500 mr-2" />
                No credit card required
              </div>
              <div className="flex items-center">
                <CheckBadgeIcon className="w-5 h-5 text-green-500 mr-2" />
                14-day free trial
              </div>
              <div className="flex items-center">
                <CheckBadgeIcon className="w-5 h-5 text-green-500 mr-2" />
                Cancel anytime
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-white/5 border-t border-white/10 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">E</span>
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  VHSS
                </span>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                The future of secure cloud computing with homomorphic encryption and verifiable computation.
              </p>
              <div className="flex space-x-4">
                {['T', 'F', 'L', 'G'].map((letter, i) => (
                  <div key={i} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer">
                    {letter}
                  </div>
                ))}
              </div>
            </div>

            {[
              {
                title: 'Product',
                links: ['Features', 'Pricing', 'Security', 'Roadmap']
              },
              {
                title: 'Solutions',
                links: ['Enterprise', 'Research', 'Healthcare', 'Finance']
              },
              {
                title: 'Resources',
                links: ['Documentation', 'API Reference', 'Blog', 'Support']
              }
            ].map((column, i) => (
              <div key={i}>
                <h4 className="font-semibold text-lg mb-4">{column.title}</h4>
                <ul className="space-y-3">
                  {column.links.map((link, j) => (
                    <li key={j}>
                      <a href="#" className="text-gray-400 hover:text-white transition-colors">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-white/10 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm">
            <p>&copy; 2024 EVHSS. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default Landing;